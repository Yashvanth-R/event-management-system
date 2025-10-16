<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|min:3',
            'location' => 'required|string|max:255|min:3',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'max_capacity' => 'required|integer|min:1|max:10000'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Event name is required',
            'name.min' => 'Event name must be at least 3 characters',
            'location.required' => 'Event location is required',
            'location.min' => 'Event location must be at least 3 characters',
            'start_time.required' => 'Start time is required',
            'start_time.after' => 'Start time must be in the future',
            'end_time.required' => 'End time is required',
            'end_time.after' => 'End time must be after start time',
            'max_capacity.required' => 'Maximum capacity is required',
            'max_capacity.min' => 'Maximum capacity must be at least 1',
            'max_capacity.max' => 'Maximum capacity cannot exceed 10,000'
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}