# Diagnostic Notes

Commands used during review:

- `ls`
- `find .. -name AGENTS.md -print`
- `cat README.md`
- `ls src`
- `cat package.json`
- `cat tsconfig.json`
- `sed -n '1,200p' src/server.ts`
- `sed -n '1,200p' src/config/env.ts`
- `sed -n '1,200p' src/routes/orders.routes.ts`
- `sed -n '1,200p' src/routes/courier.routes.ts`
- `sed -n '1,200p' src/routes/tracking.routes.ts`
- `sed -n '1,200p' src/routes/public.routes.ts`
- `sed -n '1,200p' src/services/order.service.ts`
- `sed -n '200,400p' src/services/order.service.ts`
- `sed -n '1,200p' src/services/location.service.ts`
- `sed -n '1,200p' src/services/whatsapp.service.ts`
- `sed -n '1,200p' src/middleware/auth.middleware.ts`
- `sed -n '1,200p' src/middleware/validation.middleware.ts`
- `sed -n '1,200p' src/utils/phone.util.ts`
- `sed -n '1,200p' public/customer-track.html`
- `sed -n '1,220p' public/courier-track.html`
- `sed -n '220,440p' public/courier-track.html`
- `cat prisma/schema.prisma`
- `npm run build`
