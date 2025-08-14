<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->ulid('id')->primary();   // ULID primary key (char(26))
            $table->string('location');      // e.g., "3rd Floor — Records Office"
            $table->softDeletes();           // deleted_at
            $table->timestamps();            // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
