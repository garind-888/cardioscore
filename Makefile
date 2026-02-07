.PHONY: dev prod ios

dev:
	npx vite --open

prod:
	npx tsc -b && npx vite build

ios:
	npm run build && npx cap sync ios && npx cap open ios
