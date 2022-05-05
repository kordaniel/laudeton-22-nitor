Source https://www.avoindata.fi/data/fi/dataset/none

grep copy 2000 most common surenames, 1000 male+female names to text files

Choose random rows:
shuf -n 250 etunimet.txt > first-names.txt
shuf -n 250 sukunimet.txt > last-names.txt

Merge random rows:
paste first-names.txt last-names.txt > user-names.tsv

Create emailified names:
cat user-names.tsv| tr '[[:upper:]]' '[[:lower:]]' | sed -e 's/[Öö]/o/g' -e 's/[Ää]/a/g' > lower-case.tsv

Merge name + email:
paste user-names.tsv lower-case.tsv | sed 's/\(.*\)\t\(.*\)\t\(.*\)\t\(.*\)/\3.\4@nitor.com,\1 \2/' > users.txt

