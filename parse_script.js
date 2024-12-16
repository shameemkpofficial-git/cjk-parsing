const fs = require('fs');
const path = require('path');

function extractDataFromHTML(htmlContent, category) {
    const result = [];
    
    const regex = /([^\n]+)\t([^\n]+)\t([^\n]+)?\t(■[^\n]+)?/g;
    
    let match;
    
    
    while ((match = regex.exec(htmlContent)) !== null) {
        const english = match[1].trim();
        const japanese = match[2].trim();
        const acronym = match[3] ? match[3].trim() : '';
        const information = match[4] ? match[4].trim() : '';
        
        console.log(`Matched: ${english} | ${japanese} | ${acronym} | ${information}`);
        
        result.push(`${english}\t${japanese}\t${acronym}\t${information}\t${category}`);
    }
    
    return result;
}

function processHTMLFiles(folderPath) {
    const resultData = [];
    
    if (!fs.existsSync(folderPath)) {
        console.log(`Error: The folder path '${folderPath}' is invalid.`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    
    files.forEach(fileName => {
        const filePath = path.join(folderPath, fileName);
        
        if (fs.statSync(filePath).isFile() && fileName.endsWith('.htm')) {
            try {
                console.log(`Processing file: ${fileName}`);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                
                const category = fileName.replace('.htm', ''); 
                
                const parsedData = extractDataFromHTML(fileContent, category);
                resultData.push(...parsedData);
            } catch (error) {
                console.error(`Error processing file ${fileName}:`, error.message);
            }
        }
    });
    
    if (resultData.length > 0) {
        try {
            fs.writeFileSync('result.tab', resultData.join('\n'), 'utf-8');
            console.log("Result has been written to 'result.tab'");
        } catch (error) {
            console.error("Error writing result.tab:", error.message);
        }
    } else {
        console.log("No data was parsed, 'result.tab' will remain empty.");
    }
}

processHTMLFiles('./htm');
