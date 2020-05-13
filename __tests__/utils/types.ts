interface GenericDevice {
    name: string
    type: string
}

// RFID READER

export namespace RfidReader {
    export type Type = 'RFID_READER'
    export type Tag = string
    export type Protocol = { EM4100: string, ISO11785_FDX_B: string, PHIDGET_TAG: string }
    export interface Device extends GenericDevice { type: Type }
}

// ROTARY ENCODER

export namespace RotaryEncoder {
    export type Type = 'ROTARY_ENCODER'
    export interface Device extends GenericDevice { type: Type }
}
