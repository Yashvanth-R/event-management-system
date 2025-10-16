<?php

namespace App\Exceptions;

use Exception;

class EventCapacityExceededException extends Exception
{
    protected $message = 'Event has reached maximum capacity';
    
    public function __construct($message = null)
    {
        parent::__construct($message ?? $this->message);
    }

    public function render()
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'error_code' => 'CAPACITY_EXCEEDED'
        ], 409);
    }
}