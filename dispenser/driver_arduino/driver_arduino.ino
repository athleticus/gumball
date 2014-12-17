// Adafruit Motor shield library
// copyright Adafruit Industries LLC, 2009
// this code is public domain, enjoy!

#include <AFMotor.h>
#define SWITCH_PIN 2

AF_DCMotor motor(2);

void setup() 
{
  Serial.begin(9600);           // set up Serial library at 9600 bps
  Serial.println("Motor test!");
  pinMode(SWITCH_PIN, INPUT);
}

void loop() {
  int randNumber;
  int i;
  
  if(digitalRead(SWITCH_PIN)) { 
    randNumber = (int) random(100) + 100;
    Serial.println(randNumber);
    Serial.println("Motor Running");
    motor.run(FORWARD);
    for (i=0; i<255; i++) {
      motor.setSpeed(i);  
      delay(3);
    }
    //wait for pin to be low
    while(digitalRead(SWITCH_PIN))
        ;
    for (i=255; i!=0; i--) {
      motor.setSpeed(i);  
      delay(3);
    }
    motor.run(RELEASE);
    Serial.println("Motor Stop");
    
  }
}


