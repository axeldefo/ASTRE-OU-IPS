import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Define weights and importance factors for IPS and ASTRE hypotheses
weights_ips = [4, 5, 4, 5, 3]  # Weights for IPS questions
importance_ips = [4, 5, 3, 3, 3]  # Importance for IPS

weights_astre = [4, 4, 5, 3, 4]  # Weights for ASTRE questions
importance_astre = [4, 4, 4, 3, 4]  # Importance for ASTRE


# Hypothèses pour IPS et ASTRE
hypotheses_ips = [
    "Question 4: Motivation pour venir en cours (Les copains/Les profs)",
    "Question 5: Associations intéressantes (ENSIMersion/24h du code) avec entreprises",
    "Question 21: Travail sans code (Oui) avec entreprises non codées",
    "Question 7: Formation antérieure (Prépa BL)",
    "Question 6: Spécialités au BAC (SES/SVT) avec entreprises spécifiques"
]

hypotheses_astre = [
    "Question 8: Spécialité (GEII) sans associations spécifiques",
    "Question 12: Langages connus (Assembleur/Shell) avec EnsimElec",
    "Question 17: Bureau (Carte électronique/Arduino) avec passion pour bricolage",
    "Question 21: Pas de travail sans code (Non) avec entreprises techniques",
    "Question 18: Système d’exploitation (Linux) sans certaines entreprises"
]

# Affichage des hypothèses, poids et importance
print("Hypotheses IPS avec poids et importance:")
for i in range(len(hypotheses_ips)):
    print(f"{hypotheses_ips[i]} - Poids: {weights_ips[i]}, Importance: {importance_ips[i]}, Total: {weights_ips[i] * importance_ips[i]}")
print("Total IPS: ", sum(weights_ips[i] * importance_ips[i] for i in range(len(weights_ips))))
print("\nHypotheses ASTRE avec poids et importance:")
for i in range(len(hypotheses_astre)):
    print(f"{hypotheses_astre[i]} - Poids: {weights_astre[i]}, Importance: {importance_astre[i]}, Total: {weights_astre[i] * importance_astre[i]}")
print("Total ASTRE: ", sum(weights_astre[i] * importance_astre[i] for i in range(len(weights_astre)))   )

# Read the CSV file with necessary columns
df = pd.read_csv("Validateur.csv", usecols=[
    'Nom',
    'NumEtu',
    '18. Quel(s) système(s) d’exploitation utilises-tu ?',
    '11. Es-tu plutôt : (plusieurs choix possibles)',
    '17. Qu’est-ce que tu as sur ton bureau ?',
    '12. Quels sont les langages informatiques que tu connais ?',
    '8. Quelles étaient tes spécialités (Quel BTS, BUT, Prépa) ? ',
    '7. Quelles sont ta/tes formation(s) antérieure(s) ?',
    '21. Envisagez vous un travail sans code/programmation plus tard ?',
    '5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?',
    '4. Qu’est-ce qui te motive à venir en cours ?',
    '6. Quelles spécialités as-tu prises au BAC ?',
    '20. Quelles activités te passionnent le plus?',
    '10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ' 
])

# Function to calculate total score for a specialization based on weights and importance
def calculate_score(row):
    score_ips = 0
    score_astre = 0
    
   # Check conditions for IPS
    if ('Les copains' in row['4. Qu’est-ce qui te motive à venir en cours ?'] or
        'Les profs' in row['4. Qu’est-ce qui te motive à venir en cours ?']) and \
        ('Les TP' not in row['4. Qu’est-ce qui te motive à venir en cours ?'] and
        'Les profs' not in row['4. Qu’est-ce qui te motive à venir en cours ?']):
        score_ips += weights_ips[0] * importance_ips[0]  # Question 4

    if ('ENSIMersion' in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?'] or
        '24h du code' in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?'] or
        'AgiLeMans' in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?']) and \
        ('Ubisoft' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] or
        'Sopra Steria' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] or
        'MMA' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] or
        'Je ne sais pas/aucun' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']) and \
        ('STMicroelectronics' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] and
        'Schneider Electric' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] and
        'ANSSI' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']):
        score_ips += weights_ips[1] * importance_ips[1]
          # Question 5

    if 'Oui' in row['21. Envisagez vous un travail sans code/programmation plus tard ?'] and \
        ('STMicroelectronics' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] and
        'Schneider Electric' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']):
        score_ips += weights_ips[2] * importance_ips[2]  # Question 21

    if 'Prépa BL' in row['7. Quelles sont ta/tes formation(s) antérieure(s) ?']:
        score_ips += weights_ips[3] * importance_ips[3]  # Question 7

    if ('SES' in row['6. Quelles spécialités as-tu prises au BAC ?'] or
        'SVT' in row['6. Quelles spécialités as-tu prises au BAC ?']) and \
        ('MMA' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] and
        'Sopra Steria' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] and
        'Je ne sais pas' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']):
        score_ips += weights_ips[4] * importance_ips[4]

    # Check conditions for ASTRE
    if 'GEII' in row['8. Quelles étaient tes spécialités (Quel BTS, BUT, Prépa) ? '] and \
        ('AgiLeMans' not in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?'] and
        'ENSIMersion' not in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?'] and
        'BDLC (Kfet, Trublions, Kartel, ...)' not in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?']):
        score_astre += weights_astre[0] * importance_astre[0]  # Question 8

    if ('Assembleur' in row['12. Quels sont les langages informatiques que tu connais ?'] or
        'Shell / Bash' in row['12. Quels sont les langages informatiques que tu connais ?']) and \
        'EnsimElec' in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?']:
        score_astre += weights_astre[1] * importance_astre[1]  # Question 12

    if ('Carte electronique' in row['17. Qu’est-ce que tu as sur ton bureau ?'] or
        'Arduino/Raspberry Pi' in row['17. Qu’est-ce que tu as sur ton bureau ?']) and \
        'Bricolage' in row['20. Quelles activités te passionnent le plus?']:
        score_astre += weights_astre[2] * importance_astre[2]  # Question 17

    if 'Non' in row['21. Envisagez vous un travail sans code/programmation plus tard ?'] and \
        ('STMicroelectronics' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '] or
        'Schneider Electric' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']
        or 'ANSSI' in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']):
        score_astre += weights_astre[3] * importance_astre[3]  # Question 21

    if 'Linux' in row['18. Quel(s) système(s) d’exploitation utilises-tu ?'] and \
        'MMA' not in row['10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? ']:
        score_astre += weights_astre[4] * importance_astre[4]  # Question 18

    return score_ips, score_astre

# Apply scoring function to each row
df['Score IPS'], df['Score ASTRE'] = zip(*df.apply(calculate_score, axis=1))


# Nombre d'étudiants
n_students = df.shape[0]

# Configuration du graphique
fig, ax = plt.subplots(figsize=(10, 7))

# Générer les positions des étudiants sur l'axe y
y_pos = np.arange(n_students)

# Dessiner les barres IPS et ASTRE en partant du centre (0)
ax.barh(y_pos, df['Score IPS'], color='skyblue', label='IPS')
ax.barh(y_pos, -df['Score ASTRE'], color='salmon', label='ASTRE')

# Ajouter les valeurs des scores sur chaque barre (pour IPS et ASTRE)
for i in range(n_students):
    ax.text(df['Score IPS'].iloc[i] + 1, y_pos[i], str(df['Score IPS'].iloc[i]), va='center', color='blue')  # Pour IPS
    ax.text(-df['Score ASTRE'].iloc[i] - 2, y_pos[i], str(df['Score ASTRE'].iloc[i]), va='center', color='red')  # Pour ASTRE

# Ajouter les labels, titre et légende
ax.set_yticks(y_pos)
ax.set_yticklabels(df['Nom'])
ax.set_xlabel('Scores')
ax.set_title('Scores IPS et ASTRE des étudiants')
ax.axvline(0, color='black',linewidth=0.5)  # Ajouter la ligne centrale
ax.legend()

# Afficher le graphique
plt.tight_layout()
plt.show()


