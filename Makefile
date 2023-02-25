install:
	npm ci

prepare-env:
	echo "apiId=\napiHash=\nbettingChannelId=\nstringSession=" > test.txt 

lint-fix:
	npx eslint . --fix