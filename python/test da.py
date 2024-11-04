import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Define weights and importance factors for IPS and ASTRE hypotheses
weights_ips = [4, 5, 4, 3]  # Weights for IPS questions
importance_ips = [4, 2, 3, 5]  # Importance for IPS

weights_astre = [4, 5, 5, 3, 3, 5]  # Weights for ASTRE questions
importance_astre = [3, 5, 5, 3, 4, 3]  # Importance for ASTRE

# Hypothèses pour IPS
hypotheses_ips = [
    "Q1: Motivation pour venir en cours (Les copains / Les profs)",
    "Q2: Associations/envents intéressants (ENSIMersion / 24h du code) avec des entreprises",
    "Q3: Travail sans code (Oui) avec des entreprises non codées",
    "Q4: Spécialités au BAC (SES / SVT) avec des entreprises spécifiques"
]

# Hypothèses pour ASTRE
hypotheses_astre = [
    "Q5: Spécialité (GEII) sans associations spécifiques",
    "Q6: Langages connus (Assembleur / Shell) avec EnsimElec",
    "Q7: Bureau (Carte électronique / Arduino) avec passion pour le bricolage",
    "Q8: Pas de travail sans code (Non) avec des entreprises techniques",
    "Q9: Système d'exploitation (Linux) sans certaines entreprises",
    "Q10: Dassault ou Naval Group ..."
]

# Load data from CSV
df = pd.read_csv("Réponses.csv", usecols=[
    'Numero etudiant ',
    '18. Quel(s) système(s) d’exploitation utilises-tu ? ',
    '11. Es-tu plutôt : (3 choix maximum) ',
    '17. Qu’est-ce que tu as sur ton bureau ?',
    '12. Quels sont les langages informatiques que tu as pratiqué? ',
    '8. Quelles étaient tes spécialités (Quel BTS, BUT, Prépa) ? ',
    '7. Quelle(s) est/sont ta/tes formation(s) antérieure(s) ? ',
    '21. Envisagez vous un travail sans code/programmation plus tard ?',
    '5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?',
    '4. Qu’est-ce qui te motive à venir en cours ?',
    '6. Quelles spécialités as-tu prises au BAC ? ',
    '19. À quelle fréquence codes-tu pour des projets personnels ?',
    '20. Quelles activités te passionnent le plus? (3 choix maximum) ',
    '10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '
])

# Tri du DataFrame par 'Numero etudiant ' en ordre décroissant (de Z à A)
df = df.sort_values(by='Numero etudiant ', ascending=True)


# Define row names in a numbered structure
row_names = {
    1: '18. Quel(s) système(s) d’exploitation utilises-tu ? ',
    2: '11. Es-tu plutôt : (3 choix maximum) ',
    3: '17. Qu’est-ce que tu as sur ton bureau ?',
    4: '12. Quels sont les langages informatiques que tu as pratiqué? ',
    5: '8. Quelles étaient tes spécialités (Quel BTS, BUT, Prépa) ? ',
    6: '7. Quelle(s) est/sont ta/tes formation(s) antérieure(s) ? ',
    7: '21. Envisagez vous un travail sans code/programmation plus tard ?',
    8: '5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?',
    9: '4. Qu’est-ce qui te motive à venir en cours ?',
    10: '6. Quelles spécialités as-tu prises au BAC ? ',
    11: '19. À quelle fréquence codes-tu pour des projets personnels ?',
    12: '20. Quelles activités te passionnent le plus? (3 choix maximum) ',
    13: '10. Dans la liste d’entreprise ci-dessous, lesquelles pourraient t’intéresser ? '
}

# Define functions for scoring conditions
def check_ips_condition1(row):
    return (
        (('Les copains' in row[row_names[9]] or 
        'La Kfet' in row[row_names[9]] or 
        'Pas le choix' in row[row_names[9]]) or
        "L'obtention du diplôme" in row[row_names[9]]) and 
        ('Les TP' not in row[row_names[9]] and
         'Les profs' not in row[row_names[9]]) and 
        ('lectr' not in row[row_names[13]]) 
    )

def check_ips_condition2(row):
    return (
        ('ENSIMersion' in row[row_names[8]] or
         '24h du code' in row[row_names[8]] or
         'BDLC (Kfet, Trublions, Kartel, ...)' in row[row_names[8]] or
         'AgiLeMans' in row[row_names[8]]) and 
        ('EnsimElec' not in row[row_names[8]]) and 
        ('Ubisoft' in row[row_names[13]] or
         'Sopra Steria' in row[row_names[13]] or
         'MMA' in row[row_names[13]] or
         'Je ne sais pas/aucun' in row[row_names[13]]) and 
        (
            'Dassault' not in row[row_names[13]] and
            'naval groupe' not in row[row_names[13]] and
            'ANSSI' not in row[row_names[13]]
        )
    )

def check_ips_condition3(row):
    return (
        'Oui' in row[row_names[7]] and 
        ('STMicroelectronics' not in row[row_names[13]] and
         'Schneider Electric' not in row[row_names[13]] and
         'ANSSI' not in row[row_names[13]] and
         'Dassault' not in row[row_names[13]] and
         'naval groupe' not in row[row_names[13]]) and
        row[row_names[13]] != 'Thales'
    )

def check_ips_condition4(row):
    return (
        ('SES' in row[row_names[10]] or 'SVT' in row[row_names[10]]) and 
        ('MMA' in row[row_names[13]] or
         'Ubisoft' in row[row_names[13]] or
         'Je ne sais pas/aucun' in row[row_names[13]])
    )

def check_astre_condition1(row):
    return (
        'lectr' in row[row_names[13]] and 
        ('ANSSI' in row[row_names[13]] or
         'Dassault' in row[row_names[13]] or
         'naval groupe' in row[row_names[13]] or
         'Bouygues' in row[row_names[13]]) and 
        (('AgiLeMans' not in row[row_names[8]] and
          'ENSIMersion' not in row[row_names[8]] and
          'BDLC (Kfet, Trublions, Kartel, ...)' not in row[row_names[8]]) or
         'EnsimElec' in row[row_names[8]])
    )

def check_astre_condition2(row):
    # Liste des entreprises à vérifier
    entreprises_astre = [
        'STMicroelectronics', 
        'Schneider Electric', 
        'ANSSI', 
        'Dassault', 
        'Bouygues Télécom', 
        'naval groupe', 
        'Thales'
    ]

    # Vérification de l'hypothèse
    if ('Assembleur' in row[row_names[4]] or 'Shell / Bash' in row[row_names[4]]):
        # Compte le nombre d'entreprises trouvées dans la liste
        entreprise_count = sum([
            entreprise in row[row_names[13]] for entreprise in entreprises_astre
        ])
        
        # Si au moins 2 entreprises sont sélectionnées, retourner le score
        if entreprise_count >= 2:
            return 1
    
    # Retourner 0 si les conditions ne sont pas remplies
    return 0

def check_astre_condition3(row):
    return (
        'EnsimElec' in row[row_names[8]] and 
        ('Bricolage' in row[row_names[12]] or 
         'Plusieurs fois par semaine' in row[row_names[11]] or
         'Arduino/Raspberry Pi' in row[row_names[3]])
    )

def check_astre_condition4(row):
    return (
        'Non' in row[row_names[7]] and 
        ('Schneider Electric' in row[row_names[13]] or 
         'ANSSI' in row[row_names[13]] or
         'Dassault' in row[row_names[13]] or
         'naval groupe' in row[row_names[13]])
    )

def check_astre_condition5(row):
    return 'Linux' in row[row_names[1]]

def check_astre_condition6(row):
    return (
        ('Dassault' in row[row_names[13]] or
         'naval groupe' in row[row_names[13]] or 
         row[row_names[13]] == 'Thales' or 
         row[row_names[13]] == 'Bouygues Télécom, ' or
         row[row_names[13]] == 'Schneider Electric' or 
         row[row_names[13]] == 'ANSSI' or 
         row[row_names[13]] == 'STMicroelectronics')
    )

# Function to calculate total score for a specialization based on weights and importance
def calculate_score(row):
    score_ips = 0
    score_astre = 0

    # Check conditions for IPS
    if check_ips_condition1(row):
        score_ips += weights_ips[0] * importance_ips[0]

    if check_ips_condition2(row):
        score_ips += weights_ips[1] * importance_ips[1]

    if check_ips_condition3(row):
        score_ips += weights_ips[2] * importance_ips[2]

    if check_ips_condition4(row):
        score_ips += weights_ips[3] * importance_ips[3]

    # Check conditions for ASTRE
    if check_astre_condition1(row):
        score_astre += weights_astre[0] * importance_astre[0]

    if check_astre_condition2(row):
        score_astre += weights_astre[1] * importance_astre[1]

    if check_astre_condition3(row):
        score_astre += weights_astre[2] * importance_astre[2]

    if check_astre_condition4(row):
        score_astre += weights_astre[3] * importance_astre[3]

    if check_astre_condition5(row):
        score_astre += weights_astre[4] * importance_astre[4]

    if check_astre_condition6(row):
        score_astre += weights_astre[5] * importance_astre[5]

    return score_ips, score_astre

# Calculate scores for each student
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
ax.set_yticklabels(df['Numero etudiant '])
ax.set_xlabel('Scores')
ax.set_title('Scores IPS et ASTRE des étudiants')
ax.axvline(0, color='black',linewidth=0.5)  # Ajouter la ligne centrale
ax.legend()

# Afficher le graphique
plt.tight_layout()
plt.show()

# Determine specialization
def determine_specialization(row):
    if row['Score IPS'] > row['Score ASTRE']:
        return 'IPS'
    elif row['Score IPS'] < row['Score ASTRE']:
        return 'ASTRE'
    else:
        return 'Equal'

df['Specialization'] = df.apply(determine_specialization, axis=1)

# Display the results
print(df[['Numero etudiant ', 'Score IPS', 'Score ASTRE', 'Specialization']])
