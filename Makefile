REPORTER = spec
BIN = ./node_modules/.bin

test:
	$(BIN)/mocha --reporter $(REPORTER) --ui bdd ./test/unit/*Test.js

.PHONY: test