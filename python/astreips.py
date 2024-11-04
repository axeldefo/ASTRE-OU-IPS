import pandas as pd

# Define weights and importance factors for IPS and ASTRE hypotheses
weights_ips = [3, 4, 4, 4]  # Weights for IPS questions
importance_ips = [2, 4, 2, 3]  # Importance for IPS

weights_astre = [5, 4, 5, 3, 4]  # Weights for ASTRE questions
importance_astre = [4, 3, 5, 3, 4]  # Importance for ASTRE

# Read the CSV file with necessary columns
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
    '4. Qu’est-ce qui te motive à venir en cours ?'
])

# Remove any leading/trailing spaces from column names again
df.columns = df.columns.str.replace('\s+', ' ', regex=True)
col_name = '12. Quels sont les langages informatiques que tu as pratiqué?'
print(col_name in df.columns)
# After loading and cleaning the DataFrame
print(df.columns.tolist())  # Check the column names

# Function to calculate total score for a specialization based on weights and importance
def calculate_score(row):
    score_ips = 0
    score_astre = 0
    
    # Check conditions for IPS
    if 'Les copains' in row['4. Qu’est-ce qui te motive à venir en cours ?']:
        score_ips += weights_ips[0] * importance_ips[0]  # Question 4
    if 'ENSIMersion' in row['5. Quelle(s) association(s) et/ou événement(s) t’intéressent ?']:
        score_ips += weights_ips[1] * importance_ips[1]  # Question 5
    if 'Oui' in row['21. Envisagez vous un travail sans code/programmation plus tard ?']:
        score_ips += weights_ips[2] * importance_ips[2]  # Question 21
    if 'Prépa BL' in row['7. Quelle(s) est/sont ta/tes formation(s) antérieure(s) ? ']:
        score_ips += weights_ips[3] * importance_ips[3]  # Question 7
    
    # Check conditions for ASTRE
    if 'GEII' in row['8. Quelles étaient tes spécialités (Quel BTS, BUT, Prépa) ? ']:
        score_astre += weights_astre[0] * importance_astre[0]  # Question 8
        print("ok")
    

    if 'Assembleur' in row['12. Quels sont les langages informatiques que tu as pratiqué? ']:
        score_astre += weights_astre[1] * importance_astre[1]  # Question 12
    if 'Arduino' in row['17. Qu’est-ce que tu as sur ton bureau ?']:
        score_astre += weights_astre[2] * importance_astre[2]  # Question 17
    if 'Manuel' in row['11. Es-tu plutôt : (3 choix maximum) ']:
        score_astre += weights_astre[3] * importance_astre[3]  # Question 11
    if 'Linux' in row['18. Quel(s) système(s) d’exploitation utilises-tu ? ']:
        score_astre += weights_astre[4] * importance_astre[4]  # Question 18

    return score_ips, score_astre

# Apply scoring function to each row
df['Score IPS'], df['Score ASTRE'] = zip(*df.apply(calculate_score, axis=1))

# Calculate total scores for all students
total_ips = df['Score IPS'].sum()
total_astre = df['Score ASTRE'].sum()

# Apply proportionality to normalize scores since totals are different
max_total_ips = sum(weights_ips[i] * importance_ips[i] for i in range(len(weights_ips)))
max_total_astre = sum(weights_astre[i] * importance_astre[i] for i in range(len(weights_astre)))

# Normalize the scores
proportional_ips = total_ips / max_total_ips if max_total_ips > 0 else 0
proportional_astre = total_astre / max_total_astre if max_total_astre > 0 else 0

# Print results
print(f"Total IPS: {total_ips}, Proportional IPS: {proportional_ips}")
print(f"Total ASTRE: {total_astre}, Proportional ASTRE: {proportional_astre}")

# Determine the predicted specialization based on the higher proportional score
predicted_specialization = 'IPS' if proportional_ips > proportional_astre else 'ASTRE'

print(f"Predicted Specialization: {predicted_specialization}")

# Display scores for each student
print(df[['Numero etudiant ', 'Score IPS', 'Score ASTRE']])
