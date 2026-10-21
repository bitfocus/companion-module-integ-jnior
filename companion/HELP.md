# Integ JNIOR Companion Module

This module has been developed to control the Integ JNIOR 4 Series of automation controllers. Please reference the [JANOS Management Protocol](https://jnior.com/wp-content/uploads/dlm_uploads/2024/03/JANOS_Management_Protocol_JMP-1.pdf) document as it provides the framework upon which this module has been developed. This module requires JANOS software v1.8 or later.

## Configuration and Login

Configure the following connection details:

- **Target IP:** The JNIOR device's IP address.
- **Target Port:** The JMP server port. Leave this at `9220` unless you have configured the JMP server to use a different port.
- **Username** and **Password:** The credentials used to log in to the JNIOR Web UI.

Before connecting, enable **JANOS Management Protocol (JMP) Server Configuration** in the JNIOR Web UI and tick **Server Enabled**.

## Actions

The module provides actions to send these commands via JMP:

- **Control: Set Relay Output:** Open, close, or toggle a relay output.
- **Control: Pulse Relay Output:** Close a relay output for the selected duration.
- **Control: Reset Latch:** Reset the event-capture state of an input, with a selected duration.
- **Control: Reset Counter:** Reset the pulse count for an input.
- **Control: Reset Usage:** Reset the usage meter for an I/O port.
- **Console: Send Command:** Send a command string to the JNIOR console with a selected line ending.

Control action fields allow Inputs 1-28 and Relay Outputs 1-20; which channels are present depends on the JNIOR model and installed expansion modules.

For **Reset Usage**, channels are numbered across the device's I/O ports, starting with all inputs and then continuing with outputs. The input/output mix varies by model.

## Variables

The module exposes values reported in JNIOR Monitor messages:

- Device model, JANOS version, serial number, and monitor timestamp
- Input states and pulse counts for channels 1-28 (`inputNState`, `inputNCount`)
- Relay output states for channels 1-20 (`outputNState`)

The available physical inputs and outputs depend on the JNIOR model and installed expansion modules, so some channel variables will not be used.

## Troubleshooting

- Confirm the IP address and Target Port are correct.
- Confirm the username and password are correct.
- Confirm that the Companion host can reach the device on the network.
- Confirm that the JMP Server is enabled from the JNIOR's Web UI.
- Check the Companion log for authentication or connection errors.
- TCP connection and JMP authentication attempts time out after 15 seconds. Failed attempts are retried after 1, 2, 5, 10, 15, 30, and then 60 seconds; the delay resets after successful authentication.

If there is a specific action or feature you'd like to see implemented, please post the request on the [GitHub Issues](https://github.com/bitfocus/companion-module-integ-jnior/issues) page.
