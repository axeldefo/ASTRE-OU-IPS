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
    // Fonction pour obtenir une couleur bleue en fonction du score ASTRE
    const getAstreColor = (scoreAstre) => {
      const intensity = Math.min(255, 100 + scoreAstre * 3); // 100 à 255 (plus foncé avec un score élevé)
      return `rgb(0, 0, ${intensity})`; // Bleu
    };

    // Fonction pour obtenir une couleur verte en fonction du score IPS
    const getIpsColor = (scoreIps) => {
      const intensity = Math.min(255, 100 + scoreIps * 3); // 100 à 255 (plus foncé avec un score élevé)
      return `rgb(0, ${intensity}, 0)`; // Vert
    };

    // Préparer les données pour Highcharts
    const chartData = predictData.map(student => ({
      name: student.studentNumber,
      x: student.scoreAstre, // Position sur l'axe X
      y: student.scoreIps,   // Position sur l'axe Y
      z: Math.max(student.scoreIps, student.scoreAstre), // Taille de la bulle (basée sur la spécialisation dominante)
      specialization: student.specialization,
      color: student.specialization === 'ASTRE' ? getAstreColor(student.scoreAstre - student.scoreIps) : getIpsColor(student.scoreIps - student.scoreAstre)
    }));

    // Initialiser le graphique Highcharts
    Highcharts.chart('container', {
      chart: {
        type: 'bubble',
        plotBorderWidth: 1,
        zooming: {
          type: 'xy'
        }
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
        }
      },
      tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: '<tr><th>Numéro Étudiant:</th><td>{point.name}</td></tr>' +
          '<tr><th>Score ASTRE:</th><td>{point.x}</td></tr>' +
          '<tr><th>Score IPS:</th><td>{point.y}</td></tr>' +
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
        // Configuration de la table des données
        csv: {
           columnHeaderFormatter: function (item, key) {
              if (key === 'x') {
                return 'Score ASTRE'; // Renomme la colonne x
              }
              if (key === 'y') {
                return 'Score IPS'; // Renomme la colonne y
              }
              if (key === 'name') {
                return 'Numéro Étudiant'; // Renomme la colonne name
              }
              if (key === 'specialization') {
                return 'Spécialisation'; // Ajoute la spécialisation dans l'export
              }
              return false; // Ignore toutes les autres colonnes (par exemple, la colonne sans header)
            }
          
        }
      },
      series: [{
        data: chartData,
        keys: ['name', 'x', 'y', 'specialization']
      }]
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
        wichCsv: 'default' // changez selon vos besoins
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
        wichCsv: 'default' // changez selon vos besoins
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
        <div id="container" style={{ height: '600px', width: '900px', margin: '0 auto', alignItems: 'center', paddingRight: '13%' }}></div>
      </figure>
    </div>
  );
};

export default App;