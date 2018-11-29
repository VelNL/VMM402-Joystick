enum DIR {
    NONE = 0,
    U = 1,
    D = 2,
    L = 3,
    R = 4,
    U_L = 5,
    U_R = 6,
    D_L = 7,
    D_R = 8
}


enum KEY {
    P = 0,
    A = 1,
    B = 2,
    DOWN = 3,
    RIGHT = 4,
    UP = 5,
    LEFT = 6,
}

let Joystick_P = DigitalPin.P5;
let Joystick_X = AnalogPin.P4;
let Joystick_Y = AnalogPin.P3;
let KEY_A = DigitalPin.P5;
let KEY_B = DigitalPin.P11;
let KEY_DOWN = DigitalPin.P8;
let KEY_RIGHT = DigitalPin.P9;
let KEY_UP = DigitalPin.P10;
let KEY_LEFT = DigitalPin.P11;


/**
 * Operational remote Joystick function
 */
//% weight=20 color=#3333FF icon="\uf11b"

namespace VMM204 Joystick {
    let Read_X = 0, Read_Y = 0;
    //% blockId==JoyStickInit block="JoyStickInit"
    //% weight=100
    export function JoyStickInit(): void {
        pins.setPull(JoyStick_P, PinPullMode.PullUp);
        pins.setPull(KEY_A, PinPullMode.PullUp);
        pins.setPull(KEY_B, PinPullMode.PullUp);
        pins.setPull(KEY_DOWN, PinPullMode.PullUp);
        pins.setPull(KEY_RIGHT, PinPullMode.PullUp);
        pins.setPull(KEY_UP, PinPullMode.PullUp);
        pins.setPull(KEY_LEFT, PinPullMode.PullUp);


        //10 bits of AD conversion chip，max = 1024
        Read_X = pins.analogReadPin(Joystick_X);
        Read_Y = pins.analogReadPin(Joystick_Y);

    }


    //% blockId==Listen_Key block="Key %pin |Press"
    //% weight=90
    export function Listen_Key(pin: KEY): boolean {
        let Val = 2;

        //Read pin 
        if (pin == KEY.P) {
            Val = pins.digitalReadPin(Joystick_P);
        } else if (pin == KEY.A) {
            Val = pins.digitalReadPin(KEY_A);
        } else if (pin == KEY.B) {
            Val = pins.digitalReadPin(KEY_B);
        } else if (pin == KEY.DOWN) {
            Val = pins.digitalReadPin(KEY_RIGHT);
        } else if (pin == KEY.RIGHT) {
            Val = pins.digitalReadPin(KEY_RIGHT);
        } else if (pin == KEY.UP) {
            Val = pins.digitalReadPin(KEY_UP);
        } else {
            Val = pins.digitalReadPin(KEY_LEFT);
        }

        //registerWithDal((int)pin, MICROBIT_KEY_EVT_CLICK, body);
        //To determine the value
        if (Val == 0) {
            return true;
        } else {
            return false;
        }
    }



    //% blockId==onKey block="Key %pin |Press"
    //% weight=80
    export function onKey(pin: KEY, body: Action): void {
        let Pin = 0;

        //Read pin 

        if (pin == KEY.P) {
            Pin = JoyStick_P;
        } else if (pin == KEY.A) {
            Pin = KEY_A;
        } else if (pin == KEY.B) {
            Pin = KEY_B;
        } else if (pin == KEY.DOWN) {
            Pin = KEY_DOWN;
        } else if (pin == KEY.RIGHT) {
            Pin = KEY_RIGHT;
        } else if (pin == KEY.UP) {
            Pin = KEY_UP;
        } else {
            Pin = KEY_LEFT;
        }
        pins.onPulsed(Pin, PulseValue.Low, body);
    }



    //% blockId==Listen_Dir block="DIR Dir %pin "
    //% weight=70
    export function Listen_Dir(Dir: DIR): boolean {
        let Get_Dir = DIR.NONE;

        let New_X = pins.analogReadPin(AnalogPin.P1);
        let New_Y = pins.analogReadPin(AnalogPin.P2);

        let Right = New_X - Read_X;
        let Left = Read_X - New_X;
        let Up = New_Y - Read_Y;
        let Down = Read_Y - New_Y;

        let Dx = Math.abs(Read_X - New_X);
        let Dy = Math.abs(New_Y - Read_Y);

        let Precision = 150; //0.5v

        if (Right > Precision && Dy < Precision) {
            Get_Dir = DIR.R;
        } else if (Left > Precision && Dy < Precision) {
            Get_Dir = DIR.L;
        } else if (Up > Precision && Dx < Precision) {
            Get_Dir = DIR.U;
        } else if (Down > Precision && Dx < Precision) {
            Get_Dir = DIR.D;
        } else if (Right > Precision && Up > Precision) {
            Get_Dir = DIR.U_R;
        } else if (Right > Precision && Down > Precision) {
            Get_Dir = DIR.D_R;
        } else if (Left > Precision && Up > Precision) {
            Get_Dir = DIR.U_L;
        } else if (Left > Precision && Down > Precision) {
            Get_Dir = DIR.D_L;
        } else {
            Get_Dir = DIR.NONE;
        }

        //To determine the value
        if (Get_Dir == Dir) {
            return true;
        } else {
            return false;
        }
    }

}