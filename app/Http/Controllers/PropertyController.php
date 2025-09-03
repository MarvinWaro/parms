<?php
// File: C:\Users\MARVIN\projects\parms\app\Http\Controllers\PropertyController.php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Property;
use App\Models\Location;
use App\Models\User;
use App\Models\Condition;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Property::with(['location', 'user', 'condition'])->latest();

        // Filter properties based on user role
        if (Auth::user()->isStaff()) {
            // Staff can only see properties assigned to them
            $query->where('user_id', Auth::id());
        }
        // Admin can see all properties (no additional filtering needed)

        // Handle search
        if ($search = $request->get('search')) {
            $query->where(function($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                  ->orWhere('property_number', 'like', "%{$search}%")
                  ->orWhereHas('location', function($q) use ($search) {
                      $q->where('location', 'like', "%{$search}%");
                  })
                  ->orWhereHas('condition', function($q) use ($search) {
                      $q->where('condition', 'like', "%{$search}%");
                  });
            });
        }

        // Get total count before pagination
        $totalCount = $query->count();

        // Paginate with 10 items per page
        $properties = $query->paginate(10)->withQueryString();

        // Transform the paginated data
        $properties->through(function ($property) {
            return [
                'id' => $property->id,
                'property_number' => $property->property_number,
                'item_name' => $property->item_name,
                'location' => $property->location->location ?? 'N/A',
                'condition' => $property->condition->condition ?? 'N/A',
                'acquisition_cost' => $property->acquisition_cost,
                // Add all fields needed for editing
                'serial_no' => $property->serial_no,
                'model_no' => $property->model_no,
                'acquisition_date' => $property->acquisition_date?->format('Y-m-d'),
                'unit_of_measure' => $property->unit_of_measure,
                'quantity_per_physical_count' => $property->quantity_per_physical_count,
                'fund' => $property->fund,
                'location_id' => $property->location_id,
                'user_id' => $property->user_id,
                'condition_id' => $property->condition_id,
                'item_description' => $property->item_description,
                'remarks' => $property->remarks,
                'color' => $property->color,
                // QR code URL is PERSISTENT - never changes even when property details are updated
                'qr_code_url' => $property->getQRCodeUrl(),
            ];
        });

        // Get dropdown data for forms
        $locations = Location::all()->map(function($location) {
            return [
                'id' => $location->id,
                'name' => $location->location
            ];
        });

        $conditions = Condition::all()->map(function($condition) {
            return [
                'id' => $condition->id,
                'name' => $condition->condition
            ];
        });

        // For staff users, only show themselves in users dropdown
        // For admin users, show all users
        $users = Auth::user()->isAdmin()
            ? User::select('id', 'name')->orderBy('name')->get()
            : User::where('id', Auth::id())->select('id', 'name')->get();

        $funds = [
            ['value' => 'Fund 101', 'label' => 'Fund 101'],
            ['value' => 'Fund 151', 'label' => 'Fund 151'],
        ];

        return Inertia::render('property/index', [
            'properties' => $properties,
            'locations' => $locations,
            'users' => $users,
            'conditions' => $conditions,
            'funds' => $funds,
            'filters' => $request->only(['search']),
            'totalCount' => $totalCount,
            'userRole' => Auth::user()->role, // Pass user role to frontend
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Get all properties for bulk operations (like bulk print)
     */
    public function bulkData(Request $request): JsonResponse
    {
        $query = Property::with(['location', 'user', 'condition'])->latest();

        // Filter properties based on user role
        if (Auth::user()->isStaff()) {
            // Staff can only see properties assigned to them
            $query->where('user_id', Auth::id());
        }

        // Handle search (same as index)
        if ($search = $request->get('search')) {
            $query->where(function($q) use ($search) {
                $q->where('item_name', 'like', "%{$search}%")
                  ->orWhere('property_number', 'like', "%{$search}%")
                  ->orWhereHas('location', function($q) use ($search) {
                      $q->where('location', 'like', "%{$search}%");
                  })
                  ->orWhereHas('condition', function($q) use ($search) {
                      $q->where('condition', 'like', "%{$search}%");
                  });
            });
        }

        // If specific IDs are requested, filter by them (and ensure user has permission)
        if ($ids = $request->get('ids')) {
            $query->whereIn('id', $ids);
        }

        // Get all properties without pagination for bulk operations
        $properties = $query->get()->map(function ($property) {
            return [
                'id' => $property->id,
                'item_name' => $property->item_name,
                'property_number' => $property->property_number,
                // QR code URL remains the same for the lifetime of the property
                'qr_code_url' => $property->getQRCodeUrl(),
                'location' => $property->location->location ?? 'N/A',
                'user' => $property->user->name ?? 'N/A',
            ];
        });

        return response()->json([
            'properties' => $properties,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Staff users cannot create properties
        if (Auth::user()->isStaff()) {
            abort(403, 'Unauthorized action. Staff users cannot create properties.');
        }

        // Normalize payload: cast numbers and turn "" into null for nullable fields
        $request->merge([
            'property_number'               => trim((string) $request->input('property_number')) ?: null,
            'serial_no'                     => trim((string) $request->input('serial_no')) ?: null,
            'model_no'                      => trim((string) $request->input('model_no')) ?: null,
            'acquisition_date'              => $request->input('acquisition_date') ?: null,
            'acquisition_cost'              => $request->input('acquisition_cost') === null || $request->input('acquisition_cost') === ''
                                                ? null
                                                : (float) $request->input('acquisition_cost'),
            'unit_of_measure'               => trim((string) $request->input('unit_of_measure')) ?: null,
            'quantity_per_physical_count'   => (int) $request->input('quantity_per_physical_count', 1),
            'fund'                          => $request->input('fund') ?: null,
            'item_description'              => trim((string) $request->input('item_description')) ?: null,
            'remarks'                       => trim((string) $request->input('remarks')) ?: null,
            'color'                         => trim((string) $request->input('color')) ?: null,
        ]);

        $validated = $request->validate([
            'item_name' => ['required','string','max:255'],
            'property_number' => [
                'nullable','string','max:255',
                Rule::unique('properties', 'property_number')->whereNull('deleted_at'),
            ],
            'serial_no' => [
                'nullable','string','max:255',
                Rule::unique('properties', 'serial_no')->whereNull('deleted_at')->whereNotNull('serial_no'),
            ],
            'model_no' => ['nullable','string','max:255'],
            'acquisition_date' => ['nullable','date'],
            'acquisition_cost' => ['nullable','numeric','min:0','max:999999999999.99'],
            'unit_of_measure' => ['nullable','string','max:255'],
            'quantity_per_physical_count' => ['required','integer','min:1'],
            'fund' => ['nullable','string', Rule::in(['Fund 101','Fund 151'])],
            'location_id' => ['required','exists:locations,id'],
            'user_id' => ['required','exists:users,id'],
            'condition_id' => ['required','exists:conditions,id'],
            'item_description' => ['nullable','string'],
            'remarks' => ['nullable','string'],
            'color' => ['nullable','string','max:7','regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        Property::create($validated);

        return redirect()->back()
            ->with('success', 'Property created successfully.');
    }

    public function update(Request $request, Property $property): RedirectResponse
    {
        // Staff users cannot update properties
        if (Auth::user()->isStaff()) {
            abort(403, 'Unauthorized action. Staff users cannot update properties.');
        }

        // Normalize payload: cast numbers and turn "" into null for nullable fields
        $request->merge([
            'property_number'               => trim((string) $request->input('property_number')) ?: null,
            'serial_no'                     => trim((string) $request->input('serial_no')) ?: null,
            'model_no'                      => trim((string) $request->input('model_no')) ?: null,
            'acquisition_date'              => $request->input('acquisition_date') ?: null,
            'acquisition_cost'              => $request->input('acquisition_cost') === null || $request->input('acquisition_cost') === ''
                                                ? null
                                                : (float) $request->input('acquisition_cost'),
            'unit_of_measure'               => trim((string) $request->input('unit_of_measure')) ?: null,
            'quantity_per_physical_count'   => (int) $request->input('quantity_per_physical_count', 1),
            'fund'                          => $request->input('fund') ?: null,
            'item_description'              => trim((string) $request->input('item_description')) ?: null,
            'remarks'                       => trim((string) $request->input('remarks')) ?: null,
            'color'                         => trim((string) $request->input('color')) ?: null,
        ]);

        $validated = $request->validate([
            'item_name' => ['required','string','max:255'],
            'property_number' => [
                'nullable','string','max:255',
                Rule::unique('properties', 'property_number')->ignore($property->id)->whereNull('deleted_at'),
            ],
            'serial_no' => [
                'nullable','string','max:255',
                Rule::unique('properties', 'serial_no')->ignore($property->id)->whereNull('deleted_at')->whereNotNull('serial_no'),
            ],
            'model_no' => ['nullable','string','max:255'],
            'acquisition_date' => ['nullable','date'],
            'acquisition_cost' => ['nullable','numeric','min:0','max:999999999999.99'],
            'unit_of_measure' => ['nullable','string','max:255'],
            'quantity_per_physical_count' => ['required','integer','min:1'],
            'fund' => ['nullable','string', Rule::in(['Fund 101','Fund 151'])],
            'location_id' => ['required','exists:locations,id'],
            'user_id' => ['required','exists:users,id'],
            'condition_id' => ['required','exists:conditions,id'],
            'item_description' => ['nullable','string'],
            'remarks' => ['nullable','string'],
            'color' => ['nullable','string','max:7','regex:/^#[0-9A-Fa-f]{6}$/'],
            'source' => ['nullable','string','in:index,show'], // Add source validation
        ]);

        // Update property details - QR code URL remains unchanged
        // The physical sticker never needs to be replaced because the QR code URL
        // is based only on the property ID, which never changes
        $property->update($validated);

        // Determine redirect based on source parameter
        $source = $request->input('source', 'index'); // Default to index if not specified

        if ($source === 'show') {
            return redirect()->route('properties.show', $property->id)
                ->with('success', 'Property updated successfully.');
        }

        // Default behavior - redirect to index (for table edits)
        return redirect()->route('properties.index')
            ->with('success', 'Property updated successfully.');
    }

    public function show(Property $property): Response
    {
        // Check if staff user is trying to view a property not assigned to them
        if (Auth::user()->isStaff() && $property->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action. You can only view properties assigned to you.');
        }

        $property->load(['location', 'user', 'condition']);

        // Get dropdown data for edit modal
        $locations = Location::all()->map(function($location) {
            return [
                'id' => $location->id,
                'name' => $location->location
            ];
        });

        $conditions = Condition::all()->map(function($condition) {
            return [
                'id' => $condition->id,
                'name' => $condition->condition
            ];
        });

        // For staff users, only show themselves in the users dropdown
        $users = Auth::user()->isAdmin()
            ? User::select('id', 'name')->orderBy('name')->get()
            : User::where('id', Auth::id())->select('id', 'name')->get();

        $funds = [
            ['value' => 'Fund 101', 'label' => 'Fund 101'],
            ['value' => 'Fund 151', 'label' => 'Fund 151'],
        ];

        $propertyData = [
            'id' => $property->id,
            'property_number' => $property->property_number,
            'item_name' => $property->item_name,
            'serial_no' => $property->serial_no,
            'model_no' => $property->model_no,
            'acquisition_date' => $property->acquisition_date?->format('Y-m-d'),
            'acquisition_cost' => $property->acquisition_cost,
            'unit_of_measure' => $property->unit_of_measure,
            'quantity_per_physical_count' => $property->quantity_per_physical_count,
            'fund' => $property->fund,
            'item_description' => $property->item_description,
            'remarks' => $property->remarks,
            'color' => $property->color,
            // QR code URL never changes - safe to print and stick permanently
            'qr_code_url' => $property->getQRCodeUrl(),
            'location' => $property->location->location ?? 'N/A',
            'user' => $property->user->name ?? 'N/A',
            'condition' => $property->condition->condition ?? 'N/A',
            'location_id' => $property->location_id,
            'user_id' => $property->user_id,
            'condition_id' => $property->condition_id,
            'created_at' => $property->created_at->format('F j, Y g:i A'),
            'updated_at' => $property->updated_at->format('F j, Y g:i A'),
        ];

        return Inertia::render('property/show', [
            'property' => $propertyData,
            'locations' => $locations,
            'users' => $users,
            'conditions' => $conditions,
            'funds' => $funds,
            'userRole' => Auth::user()->role,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Public QR code view - Always shows CURRENT property data
     * This is the magic: QR code URL never changes, but data shown is always fresh
     */
    public function publicView(Property $property): Response
    {
        // Load fresh relationships to get current data
        $property->load(['location', 'user', 'condition']);

        // Return current property data - this updates automatically when property is modified
        $propertyData = [
            'id' => $property->id,
            'property_number' => $property->property_number,
            'item_name' => $property->item_name,
            'serial_no' => $property->serial_no,
            'model_no' => $property->model_no,
            'acquisition_date' => $property->acquisition_date?->format('Y-m-d'),
            'acquisition_cost' => $property->acquisition_cost,
            'unit_of_measure' => $property->unit_of_measure,
            'quantity_per_physical_count' => $property->quantity_per_physical_count,
            'fund' => $property->fund,
            'item_description' => $property->item_description,
            'condition' => $property->condition->condition ?? 'N/A',
            'location' => $property->location->location ?? 'N/A',
            'user' => $property->user->name ?? 'N/A',
            'color' => $property->color,
            'created_at' => $property->created_at->format('F j, Y g:i A'),
            'updated_at' => $property->updated_at->format('F j, Y g:i A'),
        ];

        return Inertia::render('property/public', [
            'property' => $propertyData,
        ]);
    }

    public function destroy(Property $property): RedirectResponse
    {
        // Only admin users can delete properties (this route is already protected by middleware)
        $property->delete(); // soft delete

        return redirect()->route('properties.index')
            ->with('success', 'Property deleted successfully.');
    }
}
