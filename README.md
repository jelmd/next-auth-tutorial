This code is more or less the code of the auth v5 tutorial on youtube: see
https://www.youtube.com/watch?v=1MTyCvS05V4

```
setenv APPNAME auth-guide
npx create-next-app@rc --typescript --eslint --app --src-dir --turbo --tailwind --no-import-alias --empty ${APPNAME} ${APPNAME}
cd ${APPNAME}
npx shadcn-ui@latest init
npm install -D --legacy-peer-deps tailwindcss-animate \
	class-variance-authority clsx tailwind-merge @radix-ui/react-icons \
	@radix-ui/react-slot
npx shadcn-ui add button
	# check: components/ui/
npx shadcn-ui add card

npm i -D --legacy-peer-deps react-icons
VSCode: omkarbhede.react-icons-auto-import

npm install --legacy-peer-deps @radix-ui/react-label \
	@hookform/resolvers zod react-hook-form
npx shadcn-ui add form
npx shadcn-ui add input

npm i -D --legacy-peer-deps prisma
npm i --legacy-peer-deps @prisma/client
npx prisma init
npx prisma generate
npx prisma db push

npm i --legacy-peer-deps @auth/prisma-adapter
npm i --legacy-peer-deps bcryptjs
npm i -D --legacy-peer-deps @types/bcryptjs
npm i --legacy-peer-deps next-auth@beta

npm i --legacy-peer-deps uuid
npm i -D --legacy-peer-deps @types/uuid
# email @gmail for free
npm install --legacy-peer-deps resend
npm install --legacy-peer-deps react-spinners

npm install -D --legacy-peer-deps @radix-ui/react-dropdown-menu \
	npm install -D --legacy-peer-deps @radix-ui/react-avatar
npx shadcn-ui add dropdown-menu avatar badge

npm install -D --legacy-peer-deps sonner next-themes
npx shadcn-ui add sonner

npm i --legacy-peer-deps @radix-ui/react-switch @radix-ui/react-select
npx shadcn-ui add switch select

npm i --legacy-peer-deps @radix-ui/react-dialog
npx shadcn-ui add dialog

```

Current status: 5:58:40