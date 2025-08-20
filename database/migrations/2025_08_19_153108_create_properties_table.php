<?php
// Updated database/migrations/xxxx_xx_xx_create_properties_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('property_number')->unique();
            $table->string('item_name');
            $table->text('item_description')->nullable();
            $table->string('serial_no')->nullable();
            $table->string('model_no')->nullable();
            $table->date('acquisition_date')->nullable(); // Made nullable like your other optional fields
            $table->decimal('acquisition_cost', 15, 2)->nullable(); // Made nullable
            $table->string('unit_of_measure')->nullable(); // Made nullable
            $table->integer('quantity_per_physical_count')->default(1); // Added quantity field
            $table->string('fund')->nullable(); // Made nullable

            // Foreign keys for ULID references
            $table->char('location_id', 26);
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('restrict');

            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');

            $table->char('condition_id', 26);
            $table->foreign('condition_id')->references('id')->on('conditions')->onDelete('restrict');

            $table->text('remarks')->nullable();
            $table->string('color', 7)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
