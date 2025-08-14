<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Condition;
use Illuminate\Http\Request;

class ConditionController extends Controller
{
    public function index(): Response
    {
        // Fetch only active (not soft-deleted) conditions
        $conditions = Condition::query()
            ->oldest('created_at')  // This orders oldest first (ascending)
            ->get(['id', 'condition']);

        return Inertia::render('condition/index', [
            'conditions' => $conditions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'condition' => ['required', 'string', 'min:3', 'max:255'],
        ]);

        Condition::create($validated);

        // Redirect back to index so the new row appears
        return redirect()->back()
            ->with('success', 'Condition created.');
    }

    public function update(Request $request, Condition $condition)
    {
        $validated = $request->validate([
            'condition' => ['required', 'string', 'min:3', 'max:255'],
        ]);

        $condition->update($validated);

        return redirect()->route('condition.index')
            ->with('success', 'Condition updated.');
    }

    public function destroy(Condition $condition)
    {
        $condition->delete(); // soft delete
        return redirect()->route('condition.index')
            ->with('success', 'Condition deleted.');
    }
}
