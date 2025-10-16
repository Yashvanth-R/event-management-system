<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'start_time',
        'end_time',
        'max_capacity',
        'current_attendees'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'max_capacity' => 'integer',
        'current_attendees' => 'integer'
    ];

    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now());
    }

    public function hasCapacity(): bool
    {
        return $this->current_attendees < $this->max_capacity;
    }

    public function getRemainingCapacityAttribute(): int
    {
        return $this->max_capacity - $this->current_attendees;
    }

    public function isUpcoming(): bool
    {
        return $this->start_time > now();
    }

    public function getFormattedStartTimeAttribute(): string
    {
        return $this->start_time->format('Y-m-d H:i:s T');
    }

    public function getFormattedEndTimeAttribute(): string
    {
        return $this->end_time->format('Y-m-d H:i:s T');
    }
}