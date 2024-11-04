import React from 'react';
import './hypo.css';

const hypotheses = {
  IPS: [
    "L’étudiant est motivé à venir en cours principalement pour les copains ou pour des raisons autres que les profs et les travaux pratiques.",
    "L’étudiant s'intéresse à des associations comme ENSIMersion ou 24h du code, sans lien avec EnsimElec, mais envisage des entreprises comme Ubisoft, Sopra Steria, ou MMA.",
    "L’étudiant prévoit un travail sans programmation et n'est pas intéressé par des entreprises comme STMicroelectronics ou Dassault.",
    "L’étudiant a pris des spécialités SES ou SVT au BAC et s'intéresse à des entreprises comme MMA ou Ubisoft."
  ],
  ASTRE: [
    "L’étudiant est intéressé par des entreprises liées à l'électronique, comme ANSSI ou Dassault, et n'est pas impliqué dans des associations telles qu'AgiLeMans ou ENSIMersion.",
    "L’étudiant a des compétences en langages techniques comme l'assembleur ou Shell, et manifeste un intérêt pour au moins deux entreprises techniques.",
    "L’étudiant est impliqué dans EnsimElec et est passionné par le bricolage, avec des projets Arduino ou Raspberry Pi sur son bureau.",
    "L’étudiant ne prévoit pas de travail sans programmation et s'intéresse à des entreprises comme Schneider Electric ou ANSSI.",
    "L’étudiant utilise un système d'exploitation Linux et montre un intérêt pour des entreprises spécifiques telles que Dassault ou naval groupe.",
    "L’étudiant manifeste un intérêt pour des entreprises telles que Dassault, naval groupe, ou Thales."
  ]
};

const HypothesesTable = () => {
  return (
    <div className="hypotheses-container">
      <h1>Hypothèses</h1>
      <table className="hypotheses-table">
        <thead>
          <tr>
            <th>IPS</th>
            <th>ASTRE (1-4)</th>
            <th>ASTRE (5-6)</th>
          </tr>
        </thead>
        <tbody>
          {hypotheses.IPS.map((hypothesisIPS, index) => (
            <tr key={index}>
              <td>{hypothesisIPS}</td>
              <td>{hypotheses.ASTRE[index] || ''}</td>
              <td>{hypotheses.ASTRE[index + 4] || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HypothesesTable;
