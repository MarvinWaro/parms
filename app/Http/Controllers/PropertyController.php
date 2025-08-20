<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Property;
use App\Models\Location;
use App\Models\User;
use App\Models\Condition;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class PropertyController extends Controller
{
    public function index(): Response
    {
        $properties = Property::with(['location', 'user', 'condition'])
            ->latest()
            ->get()
            ->map(function ($property) {
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
                ];
            });

        // Simplified queries - get all data, then transform
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

        $users = User::select('id', 'name')->orderBy('name')->get();

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
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
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
            'serial_no' => ['nullable','string','max:255'],
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
            'serial_no' => ['nullable','string','max:255'],
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

        $property->update($validated);

        return redirect()->route('properties.index')
            ->with('success', 'Property updated successfully.');
    }

    public function destroy(Property $property): RedirectResponse
    {
        $property->delete(); // soft delete

        return redirect()->route('properties.index')
            ->with('success', 'Property deleted successfully.');
    }
}
