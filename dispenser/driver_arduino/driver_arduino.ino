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
  pinMode(0, INPUT); 
  pinMode(1, INPUT);
  //pinMode(1, OUTPUT);
  //digitalWrite(1, HIGH);
}

void loop() {
  int randNumber;
  int i;
  
  if(digitalRead(SWITCH_PIN)) { 
    randNumber = (int) random(100) + 100;
    Serial.println(randNumber);
    //digitalWrite(1, HIGH);
    Serial.println("Motor Running");
    motor.run(FORWARD);
    for (i=0; i<255; i++) {
      motor.setSpeed(i);  
      delay(3);
    }
    while(digitalRead(SWITCH_PIN))
        ;
    for (i=255; i!=0; i--) {
      motor.setSpeed(i);  
      delay(3);
    }
    motor.run(RELEASE);
    //digitalWrite(1,LOW);
    Serial.println("Motor Stop");
    
  }
}


