async function runScript() {
    const scriptName = document.getElementById('scriptName').value.trim();
    const argsInput = document.getElementById('argsInput').value.trim();
    const outputElement = document.getElementById('output');

    if (!scriptName) {
        alert("Please enter a script name.");
        return;
    }

    const args = argsInput ? argsInput.split(" ") : [];

    outputElement.textContent = "Running...";

    try {
        const response = await fetch('/run-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scriptName, args })
        });

        const result = await response.json();

        if (result.success) {
            let outputText = result.output;

            try {
                const jsonOutput = JSON.parse(outputText);
                outputElement.innerHTML = formatOutput(scriptName, jsonOutput);
            } catch (e) {
                outputElement.textContent = outputText; // Fallback to raw text if not JSON
            }
        } else {
            outputElement.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        outputElement.textContent = "Error connecting to the server.";
    }
}

/**
 * Function to format the output based on the script name.
 */
function formatOutput(scriptName, json) {
    return `<pre>${syntaxHighlight(json)}</pre>`; // Default to JSON prettification
}

/**
 * Function to prettify and color JSON output
 */
function syntaxHighlight(json) {
    if (typeof json !== "string") {
        json = JSON.stringify(json, null, 2); // Pretty print JSON
    }

    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
            let cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";  // JSON keys
                } else {
                    cls = "string";  // JSON string values
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";  // Boolean values
            } else if (/null/.test(match)) {
                cls = "null";  // Null values
            }
            return `<span class="${cls}">${match}</span>`;
        }
    );
}



