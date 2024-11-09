import { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import HypothesesTable from './components/ui/hypotheses/hypo';

import './App.css';

// Charger les modules supplémentaires
HighchartsMore(Highcharts);
exporting(Highcharts);
exportData(Highcharts);

const App = () => {
  const [weightsIPS, setWeightsIPS] = useState([3, 5, 4, 3]);
  const [importanceIPS, setImportanceIPS] = useState([4, 2, 3, 5]);
  const [weightsAstre, setWeightsAstre] = useState([4, 5, 5, 3, 3, 5]);
  const [importanceAstre, setImportanceAstre] = useState([3, 5, 5, 3, 4, 3]);
  const [predictData, setPredictData] = useState([]);

  useEffect(() => {
    // Effectuer une prédiction par défaut au chargement du composant
    handlePredict();
  }, []);

  useEffect(() => {

    // Function to add a random offset if coordinates are duplicated
function addOffsetIfDuplicate(data) {
  const usedCoordinates = []; // Array to track used coordinates

  return data.map(student => {
    let x = student.scoreAstre;
    let y = student.scoreIps;

    // Check if coordinates are already used
    const isDuplicate = usedCoordinates.some(coord => coord.x === x && coord.y === y);

    // Apply random offset if duplicate
    if (isDuplicate) {
      const randomOffsetX = (Math.random() - 0.4) * 3; // X-axis random offset
      const randomOffsetY = (Math.random() - 0.4) * 3; // Y-axis random offset
      x += randomOffsetX;
      y += randomOffsetY;
    }

    // Store current coordinates
    usedCoordinates.push({ x, y });

    return {
      name: student.studentNumber,
      x: x,
      y: y,
      z: Math.max(student.scoreIps, student.scoreAstre),
      vraiScoreAstre: student.scoreAstre,
      vraiScoreIps: student.scoreIps,
      specialization: student.specialization,
      color: student.specialization === 'ASTRE' ? "rgba(139, 0, 0, 0.5)" : "rgba(0, 0, 255, 0.5)"
    };
  });
}

// Apply the offset logic to ASTRE and IPS data separately
const chartDataAstre = addOffsetIfDuplicate(
  predictData.filter(student => student.specialization === 'ASTRE')
);

const chartDataIps = addOffsetIfDuplicate(
  predictData.filter(student => student.specialization === 'IPS')
);

  
  // Initialize the Highcharts chart
  Highcharts.chart('container', {
    chart: {
      type: 'bubble',
      plotBorderWidth: 1,
      zooming: {
        type: 'xy'
      },
    },
    title: {
      text: 'Prédiction des choix des étudiants (IPS et ASTRE)'
    },
    xAxis: {
      title: {
        text: 'Score ASTRE'
      },
      gridLineWidth: 1
    },
    yAxis: {
      title: {
        text: 'Score IPS'
      },
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<table>',
      pointFormat: '<tr><th>Numéro Étudiant:</th><td>{point.name}</td></tr>' +
        '<tr><th>Score ASTRE:</th><td>{point.vraiScoreAstre}</td></tr>' +
        '<tr><th>Score IPS:</th><td>{point.vraiScoreIps}</td></tr>' +
        '<tr><th>Spécialisation:</th><td>{point.specialization}</td></tr>',
      footerFormat: '</table>',
      followPointer: true
    },
    exporting: {
      buttons: {
        contextButton: {
          menuItems: [
            'viewFullscreen',
            'separator',
            'downloadPNG',
            'downloadJPEG',
            'downloadPDF',
            'downloadSVG',
            'separator',
            'downloadCSV',
            'downloadXLS',
            'viewData'
          ]
        }
      },
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
    series: [
      {
        name: 'IPS',  // Series for IPS students
        data: chartDataIps,
        maxSize: '12%',
        color: "rgba(0, 0, 255, 0.5)", // Blue color for IPS
      },
      {
        name: 'ASTRE',  // Series for ASTRE students
        data: chartDataAstre,
        maxSize: '12%',
        color: "rgba(139, 0, 0, 0.5)", // Red color for ASTRE
      }
    ],
  });
  
  }, [predictData]);


  const handlePredict = async () => {
    // Appel à l'API pour prédire les résultats
    const response = await fetch('api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weightsIPS,
        importanceIPS,
        weightsAstre,
        importanceAstre,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setPredictData(data);
    } else {
      console.error('Erreur lors de la prédiction');
    }
  };

  const handleReset = async () => {
    // Réinitialiser les valeurs par défaut
    setWeightsIPS([3, 5, 4, 3]);
    setImportanceIPS([4, 2, 3, 5]);
    setWeightsAstre([4, 5, 5, 3, 3, 5]);
    setImportanceAstre([3, 5, 5, 3, 4, 3]);

    // Réinitialiser les données de prédiction
    const response = await fetch('api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weightsIPS,
        importanceIPS,
        weightsAstre,
        importanceAstre,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setPredictData(data);
      // Effectuer une nouvelle prédiction après la réinitialisation
      handlePredict();
    } else {
      console.error('Erreur lors de la prédiction');
    }
  };

  return (
    <div className="app-container">
      <HypothesesTable />
      <form className="form">
        <h1>Formulaire de prédiction</h1>
        <div className="form2">
          {/* Formulaire IPS */}
          <div className="form-group-inline">
            <div className="spe">
              <label><b>IPS</b> Poids</label>
              {weightsIPS.map((weight, index) => (
                <div key={`weight-ips-${index}`} className="input-pair">
                  <span>{index + 1}.</span>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      const newWeights = [...weightsIPS];
                      newWeights[index] = parseInt(e.target.value, 10);
                      setWeightsIPS(newWeights);
                    }}
                    className="input-inline"
                  />
                </div>
              ))}
            </div>
            <div className="spe">
              <label>Importance</label>
              {importanceIPS.map((importance, index) => (
                <div key={`importance-ips-${index}`} className="input-pair">
                  <span>{index + 1}.</span>
                  <Input
                    type="number"
                    value={importance}
                    onChange={(e) => {
                      const newImportance = [...importanceIPS];
                      newImportance[index] = parseInt(e.target.value, 10);
                      setImportanceIPS(newImportance);
                    }}
                    className="input-inline"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire ASTRE - Premier Ensemble */}
          <div className="form-group-inline">
            <div className="spe">
              <label><b>ASTRE</b> Poids</label>
              {weightsAstre.slice(0, 4).map((weight, index) => (
                <div key={`weight-astre-${index}`} className="input-pair">
                  <span>{index + 1}.</span>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      const newWeights = [...weightsAstre];
                      newWeights[index] = parseInt(e.target.value, 10);
                      setWeightsAstre(newWeights);
                    }}
                    className="input-inline"
                  />
                </div>
              ))}
            </div>
            <div className="spe">
              <label>Importance</label>
              {importanceAstre.slice(0, 4).map((importance, index) => (
                <div key={`importance-astre-${index}`} className="input-pair">
                  <span>{index + 1}.</span>
                  <Input
                    type="number"
                    value={importance}
                    onChange={(e) => {
                      const newImportance = [...importanceAstre];
                      newImportance[index] = parseInt(e.target.value, 10);
                      setImportanceAstre(newImportance);
                    }}
                    className="input-inline"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire ASTRE - Deuxième Ensemble */}
          <div className="form-group-inline">
            <div className="spe">
              <label><b>ASTRE</b> Poids</label>
              {weightsAstre.slice(4).map((weight, index) => (
                <div key={`weight-astre-${index + 4}`} className="input-pair">
                  <span>{index + 5}.</span>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => {
                      const newWeights = [...weightsAstre];
                      newWeights[index + 4] = parseInt(e.target.value, 10);
                      setWeightsAstre(newWeights);
                    }}
                    className="input-inline"
                  />
                </div>
              ))}
            </div>
            <div className="spe">
              <label>Importance</label>
              {importanceAstre.slice(4).map((importance, index) => (
                <div key={`importance-astre-${index + 4}`} className="input-pair">
                  <span>{index + 5}.</span>
                  <Input
                    type="number"
                    value={importance}
                    onChange={(e) => {
                      const newImportance = [...importanceAstre];
                      newImportance[index + 4] = parseInt(e.target.value, 10);
                      setImportanceAstre(newImportance);
                    }}
                    className="input-inline"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="button-group">
          <Button type="button" onClick={handleReset}>Réinitialiser</Button>
          <Button type="button" onClick={handlePredict}>Prédire</Button>
        </div>
      </form>

      <figure className="highcharts-figure">
        <div id="container" style={{ height: '700px', width: '100%', margin: '0 auto', alignItems: 'center', paddingRight: '13%' }}></div>
      </figure>
    </div>
  );
};

export default App;