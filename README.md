# README
After pulling the repository, here are simple instructions for setting up to work on the project (tested for **Windows 11**):
1. Navigate to root of project directory
2. In Terminal/PowerShell do `npm run dev`
3. You might see something like 
    ```
    - Local:         http://localhost:3000
    - Network:       http://10.0.0.96:3000
    ```
    You can use the local address in your browser to see changes you make to the code.
4. Then open a coding session in the root directory using your IDE. For me (Nathan) I have to open a new PowerShell window since running the dev command doesn't release control of the terminal again. Navigating back to the root directory, run `code .` (VSCode) to open the environment