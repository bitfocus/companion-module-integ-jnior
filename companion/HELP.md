# Integ JNIOR Companion Module

This module has been developed to control the Integ JNIOR 4 Series of automation controllers. Please reference the [JANOS Management Protocol](https://jnior.com/wp-content/uploads/dlm_uploads/2024/03/JANOS_Management_Protocol_JMP-1.pdf) document as it provides the framework upon which this module has been developed. This module requires JANOS software v1.8 or later.

## Configuration and Login

Enter the JNIOR device's IP address. Target Port should remain 9220 unless you have specifically configured the JANOS Management Protocol (JMP) server otherwise. The "JANOS Management Protocol (JMP) Server Configuration" must be enabled from the Web UI, with the "Server Enabled" checkbox ticked.  The login credentials are the same as those used to connect to the JNIOR's Web UI.

## Actions

The module provides actions for the following commands via the JMP. Note this is not a complete list of all of the commands available in the JMP; version 1.0 of this module is limited in scope to basic relay control and the console commands.

- Set Relay: Open, Close, Toggle
- Set Relay: Pulse
- Reset Latch
- Reset Counter
- Reset Usage
- Console: Send string to the JNIOR console

## Variables

The module exposes variables for the following; these are queried from the monitor message sent by the JNIOR on initial connection:

- Device model, JMP version, and serial number
- Timestamp of last connection
- Input and Output States
- Input Relay Counts

## Troubleshooting

- Confirm the IP address and Target Port are correct.
- Confirm the username and password are correct.
- Confirm that the Companion host can reach the device on the network.
- Confirm that the JMP Server is enabled from the JNIOR's Web UI.
- Check the Companion log for authentication or connection errors.

If there is a specific action or feature you'd like to see implemented, please post the request on the [GitHub Issues](https://github.com/bitfocus/companion-module-integ-jnior/issues) page.
