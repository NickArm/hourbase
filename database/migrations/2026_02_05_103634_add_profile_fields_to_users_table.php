<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('default_hourly_rate', 10, 2)->default(0)->after('password');
            $table->string('currency', 3)->default('EUR')->after('default_hourly_rate');
            $table->decimal('vat_rate', 5, 2)->default(24)->after('currency');
            $table->string('role')->default('user')->after('vat_rate');
            $table->boolean('is_active')->default(true)->after('role');

            $table->string('company_name')->nullable()->after('is_active');
            $table->string('tax_id')->nullable()->after('company_name');
            $table->string('address')->nullable()->after('tax_id');
            $table->string('city')->nullable()->after('address');
            $table->string('postal_code')->nullable()->after('city');
            $table->string('country')->nullable()->after('postal_code');
            $table->string('phone')->nullable()->after('country');
            $table->string('business_email')->nullable()->after('phone');
            $table->string('logo_url')->nullable()->after('business_email');
            $table->text('bank_details')->nullable()->after('logo_url');

            $table->string('subscription_plan')->nullable()->after('bank_details');
            $table->date('subscription_start_date')->nullable()->after('subscription_plan');
            $table->date('subscription_end_date')->nullable()->after('subscription_start_date');
            $table->string('subscription_status')->nullable()->after('subscription_end_date');

            $table->timestamp('last_login_at')->nullable()->after('subscription_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'default_hourly_rate',
                'currency',
                'vat_rate',
                'role',
                'is_active',
                'company_name',
                'tax_id',
                'address',
                'city',
                'postal_code',
                'country',
                'phone',
                'business_email',
                'logo_url',
                'bank_details',
                'subscription_plan',
                'subscription_start_date',
                'subscription_end_date',
                'subscription_status',
                'last_login_at',
            ]);
        });
    }
};
