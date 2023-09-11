import { Elysia, t } from "elysia";
import { html } from '@elysiajs/html'
import { type PropsWithChildren } from '@kitajs/html';

const app = new Elysia();
app.use(html());

app.get('/output.css', () => Bun.file('./tailwindcss/output.css'))

app.get('/', () => (
    <BaseHtml>
        <body
            class="flex w-full h-screen justify-center items-center"
            hx-get="/container"
            hx-swap="innerHTML"
            hx-trigger="load"
        />
    </BaseHtml>
));

app.get('/container', () => (
    <div id="container" class="flex gap-3">
        <div class="h-20 w-20 bg-red-600" style={"view-transition-name: box1"} hx-get="/page/1" hx-target="#container" />
        <div class="h-20 w-20 bg-blue-600" style={"view-transition-name: box2"} hx-get="/page/2" hx-target="#container" />
        <div class="h-20 w-20 bg-yellow-600" style={"view-transition-name: box3"} hx-get="/page/3" hx-target="#container" />
    </div>
));

app.get('/page/:id', ({ params: { id } }) => {
    switch (+id) {
        case 1:
            return <div class="h-40 w-40 bg-red-600" style={"view-transition-name: box1"} hx-get="/container" hx-swap="outerHTML" />;
        case 2:
            return <div class="h-40 w-40 bg-blue-600" style={"view-transition-name: box2"} hx-get="/container" hx-swap="outerHTML" />;
        case 3:
            return <div class="h-40 w-40 bg-yellow-600" style={"view-transition-name: box3"} hx-get="/container" hx-swap="outerHTML" />;
        default:
            return <div class="h-40 w-40 bg-yellow-600" style={"view-transition-name: box3"} hx-get="/container" hx-swap="outerHTML" />;
    }
},
    {
        params: t.Object({
            id: t.String()
        })
    }
);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


const BaseHtml = ({ children }: PropsWithChildren) => `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>THE BETH STACK</title>
<script src="https://unpkg.com/htmx.org@1.9.3"></script>
<script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
<script> htmx.config.globalViewTransitions = true; </script>
<link href="/output.css" rel="stylesheet">
</head>

${children}
`;
