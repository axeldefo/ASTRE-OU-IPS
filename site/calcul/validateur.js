const path = require('path');
const fs = require('fs');
const Papa = require('papaparse'); 

// Noms de colonnes à utiliser pour les conditions
const rowNames = {
  0: 'NumEtu',
  1: '18. Quel(s) système(s) d’exploitation utilises-tu ?',
  2: '11. Es-tu plutôt : (plusieurs choix possibles)',
  3: '17. Qu’est-ce que tu as sur ton bureau ?',
  4: '12. Quels sont les langages informatiques que tu connais ?',
  5: '8. Quelles étaient tes spécialités (Quel BTS, BUT, Prépa) ? ',
  6: '7. Quelles sont ta/tes formation(s) antérieure(s) ?',
  7: '21. Envisagez vous un travail sans code/programmation plus tard ?',
  8: '5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?',
  9: '4. Qu’est-ce qui te motive à venir en cours ?',
  10: '6. Quelles spécialités as-tu prises au BAC ?',
  11: '19. À quelle fréquence codes-tu pour des projets personnels ?',
  12: '20. Quelles activités te passionnent le plus?',
  13: '10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '
};


// Functions for checking IPS conditions
function checkIpsCondition1(row) {
  return (
    (row[rowNames[9]].includes("Les copains") || row[rowNames[9]].includes("La Kfet") || row[rowNames[9]].includes("Pas le choix") || row[rowNames[9]].includes("L'obtention du diplôme")) &&
    !row[rowNames[9]].includes("Les TP") &&
    !row[rowNames[9]].includes("Les profs") &&
    !row[rowNames[13]].includes("lectr") 
  );
}

function checkIpsCondition2(row) {
  return (
    (row[rowNames[8]].includes("ENSIMersion") || row[rowNames[8]].includes("24h du code") || row[rowNames[8]].includes("BDLC (Kfet, Trublions, Kartel, ...)") || row[rowNames[8]].includes("AgiLeMans")) &&
    !row[rowNames[8]].includes("EnsimElec") &&
    (row[rowNames[13]].includes("Ubisoft") || row[rowNames[13]].includes("Sopra Steria") || row[rowNames[13]].includes("MMA") || row[rowNames[13]].includes("Je ne sais pas/aucun")) &&
    !row[rowNames[13]].includes("Dassault") &&
    !row[rowNames[13]].includes("naval groupe") &&
    !row[rowNames[13]].includes("ANSSI")
  );
}

function checkIpsCondition3(row) {
  return (
    row[rowNames[7]].includes("Oui") &&
    !["STMicroelectronics", "Schneider Electric", "ANSSI", "Dassault", "naval groupe"].some((company) => row[rowNames[13]].includes(company)) &&
    row[rowNames[13]] !== "Thales"
  );
}

function checkIpsCondition4(row) {
  return (
    (row[rowNames[13]].includes("MMA") || row[rowNames[13]].includes("Ubisoft") || row[rowNames[13]].includes("Je ne sais pas/aucun")) &&
    (row[rowNames[10]].includes("SES") || row[rowNames[10]].includes("SVT") ||
    row[rowNames[6]].includes("Prépa BL"))
    
  );
}

// Functions for checking ASTRE conditions
function checkAstreCondition1(row) {
  return (
    row[rowNames[13]].includes("lectr") &&
    ["ANSSI", "Dassault", "naval groupe", "Bouygues"].some((company) => row[rowNames[13]].includes(company)) &&
    (!["AgiLeMans", "ENSIMersion", "BDLC (Kfet, Trublions, Kartel, ...)"].some((assoc) => row[rowNames[8]].includes(assoc)) || row[rowNames[8]].includes("EnsimElec"))
  );
}

function checkAstreCondition2(row) {
  const entreprisesAstre = ["STMicroelectronics", "Schneider Electric", "ANSSI", "Dassault", "Bouygues Télécom", "naval groupe", "Thales"];
  return (
    (row[rowNames[4]].includes("Assembleur") || row[rowNames[4]].includes("Shell / Bash")) &&
    entreprisesAstre.filter((entreprise) => row[rowNames[13]].includes(entreprise)).length >= 2
  );
}

function checkAstreCondition3(row) {
  return (
    row[rowNames[8]].includes("EnsimElec") &&
    (row[rowNames[12]].includes("Bricolage") || row[rowNames[11]].includes("Plusieurs fois par semaine") || row[rowNames[3]].includes("Carte electronique"))
  );
}

function checkAstreCondition4(row) {
  return (
    row[rowNames[7]].includes("Non") &&
    ["Schneider Electric", "ANSSI", "Dassault", "naval groupe"].some((company) => row[rowNames[13]].includes(company))
  );
}

function checkAstreCondition5(row) {
  return row[rowNames[1]].includes("Linux");
}

function checkAstreCondition6(row) {
  const companies = [
    "Thales", 
    "Bouygues Télécom, ", 
    "Schneider Electric", 
    "ANSSI", 
    "STMicroelectronics"
  ];

  const rowValue = row[rowNames[13]]; // Value in the 14th column

  // Check if rowValue contains "Dassault" or "naval groupe"
  if (rowValue && (rowValue.includes("Dassault") || rowValue.includes("naval groupe"))) {
    return true;
  }

  // Check if rowValue is equal to any of the other companies (excluding "Dassault" and "naval groupe")
  return companies.some((company) => rowValue === company);
}

function calculateScore(row, wIPS, impIPS, wAstre, impAstre) {
  let scoreIps = 0;
  let scoreAstre = 0;

  // Calculate IPS score
  if (checkIpsCondition1(row)) scoreIps += wIPS[0] * impIPS[0];
  if (checkIpsCondition2(row)) scoreIps += wIPS[1] * impIPS[1];
  if (checkIpsCondition3(row)) scoreIps += wIPS[2] * impIPS[2];
  if (checkIpsCondition4(row)) scoreIps += wIPS[3] * impIPS[3];

  // Calculate ASTRE score
  if (checkAstreCondition1(row)) scoreAstre += wAstre[0] * impAstre[0];
  if (checkAstreCondition2(row)) scoreAstre += wAstre[1] * impAstre[1];
  if (checkAstreCondition3(row)) scoreAstre += wAstre[2] * impAstre[2];
  
  if (checkAstreCondition4(row)) scoreAstre += wAstre[3] * impAstre[3];
  if (checkAstreCondition5(row)) scoreAstre += wAstre[4] * impAstre[4];
  if (checkAstreCondition6(row)) scoreAstre += wAstre[5] * impAstre[5];

  return { scoreIps, scoreAstre };
}


// Determine specialization based on scores
function determineSpecialization(row, weightsIPS, importanceIPS, weightsAstre, importanceAstre) {
  // Use calculateScore with the required parameters
  const { scoreIps, scoreAstre } = calculateScore(row, weightsIPS, importanceIPS, weightsAstre, importanceAstre);

  if (scoreIps > scoreAstre) return "IPS";
  if (scoreAstre > scoreIps) return "ASTRE";
  return "Equal";
}

// calcul des scores et détermination de la spécialisation
// calcul des scores et détermination de la spécialisation
async function processCsvDataValidateur(req, res) {
  const { weightsIPS, importanceIPS, weightsAstre, importanceAstre, wichCsv } = req.body;
  
  // Determine the CSV file path
  const csvPath = wichCsv === "new"
    ? path.join(__dirname, '../uploads/new.csv')
    : path.join(__dirname, '../uploads/Réponses.csv');

  console.log("File path: ", csvPath);

  // Verify that weights and importance are defined
  if (!weightsIPS || !importanceIPS || !weightsAstre || !importanceAstre) {
    console.log("Missing parameters in the request.");
    return res.status(400).json({ message: 'Missing parameters in the request.' });
  }

  // Initialize an array to hold the final results
  const finalResults = [];

  fs.readFile(csvPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err);
      return res.status(500).json({ message: 'Error reading CSV file.' });
    }

    // Parse the CSV data
    Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        results.data.forEach((row) => {

          console.log (row)
          // Safely extract the student number, ensure it's not undefined or null
          const studentNumber = row['NumEtu'] ;

          // Calculate scores
          const { scoreIps, scoreAstre } = calculateScore(row, weightsIPS, importanceIPS, weightsAstre, importanceAstre);
          const specialization = determineSpecialization(row, weightsIPS, importanceIPS, weightsAstre, importanceAstre);

          // Push the result into the finalResults array
          finalResults.push({
            studentNumber,
            scoreIps,
            scoreAstre,
            specialization
          });
        });

        // Sort final results by student number (safely)
        finalResults.sort((a, b) => {
          const studentA = a.studentNumber || '';
          const studentB = b.studentNumber || '';
          return studentA.localeCompare(studentB);
        });

        res.json(finalResults);
      }
    });
  });
}

module.exports = { processCsvDataValidateur };
