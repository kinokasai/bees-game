all:
	mlr --c2j sort -f name cards.csv > cards.json
	sed -r 's/\\n/n/g' cards.json -i

upgrades:
	mlr --c2j sort -f  name upgrades.csv > upgrades.json
