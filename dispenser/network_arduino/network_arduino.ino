// **** Headers **** //

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <EEPROM.h>

// **** Defines **** //

#define SWITCH_PIN 2

// **** Globals **** //

// IP //
byte mac[]    = {  
  0x90, 0xA2, 0xDA, 0x00, 0x00, 0x05 };
byte server[] = { 
  130, 102, 129, 175 };
EthernetClient ethClient;

// mqtt // 
static char topic[80];
static char clientId[80];

// General //
int motorSwitch = 0;
const int MSG_LEN = 80;
String strPayload;
int delayTime = 1000;

// **** Prototypes **** //

void callback(char* topic, byte* payload, unsigned int length);

// **** Callback Functions **** //

PubSubClient client(server, 1883, callback, ethClient);

// **** Callback **** //

// callback for message received on arduinoInTopic
void callback(char* topic, byte* payload, unsigned int length) {

  Serial.print("got:");

  int number = 0;

  payload[length] = '\0';
  String strPayload = String((char*)payload);
  Serial.println(strPayload);
  delayTime = strPayload.toInt();

  // convert to an int
  motorSwitch = 1;

  // some debugging
  Serial.print("Dispensing: ");
  Serial.println(motorSwitch);
}

void setup()
{
  // setup Pin
  pinMode(SWITCH_PIN, OUTPUT);
  digitalWrite(SWITCH_PIN, LOW);

  // initilise all the stuff
  Serial.begin(9600);
  static char IPstring[80];

  // start DHCP
  Serial.print("DHCP Starting");
  while(Ethernet.begin(mac) == 0) {
    Serial.print("No DHCP yet... retrying");
    delay(1000);
  }

  // DHCP finished, print results
  Serial.print("\nIP Address: ");
  sprintf(IPstring, "%u.%u.%u.%u", Ethernet.localIP()[0], Ethernet.localIP()[1], Ethernet.localIP()[2], Ethernet.localIP()[3]);
  Serial.println(IPstring);

  // sub and pub on topics  
  if (client.connect("GumBall")) {
    client.publish("gumballlog","GumBall Connected");
    client.subscribe("mm-dispenser");
  }
}

void loop()
{
  // check that connection to the mqqt server is live
  if(!client.connected()) {
    if(!client.connect("GumBall")) {
      delay(1000);
      return;
    }
    // reconnect
    client.publish("gumballlog","GumBall Reconnected");
    client.subscribe("ait");
  }

  // loop mqtt
  client.loop();

  if(motorSwitch) {
    Serial.println("Motor On");
    digitalWrite(SWITCH_PIN, HIGH);
    delay(delayTime) ;
    digitalWrite(SWITCH_PIN, LOW);
    Serial.println("Motor Off");
    motorSwitch = 0;
  }
}


