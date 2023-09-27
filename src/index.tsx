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
            hx-push-url="true"
        />
    </BaseHtml>
));

app.get('/container', ({ headers }) => {
    const Wrapper = isHTMXRequest(headers) ? Fragment : BaseBody;
    return (
        <Wrapper>
            <div id="container" class="flex gap-3">
                <div _="on mouseenter add .border-4 on mouseout remove .border-4 on me" hx-push-url="true" class="transition border-black h-21 w-20 bg-red-600" style={"view-transition-name: box1"} hx-get="/page/1" hx-target="#container" />
                <div _="on mouseenter add .border-4 on mouseout remove .border-4 on me" hx-push-url="true" class="transition border-black h-20 w-20 bg-blue-600" style={"view-transition-name: box2"} hx-get="/page/2" hx-target="#container" />
                <div _="on mouseenter add .border-4 on mouseout remove .border-4 on me" hx-push-url="true" class="transition border-black h-20 w-20 bg-yellow-400" style={"view-transition-name: box3"} hx-get="/page/3" hx-target="#container" />
            </div>
        </Wrapper>
    );
});

type colorType = {
    bgColor: string;
    textColor: string;
    selectionColor: string;
    name: string;
};

const colors: Record<number, colorType> = {
    1: {
        bgColor: 'bg-red-600',
        textColor: 'first-letter:text-red-600',
        selectionColor: 'selection:bg-red-600 selection:text-white',
        name: 'Red',
    },
    2: {
        bgColor: 'bg-blue-600',
        textColor: 'first-letter:text-blue-600',
        selectionColor: 'selection:bg-blue-600 selection:text-white',
        name: 'Blue',
    },
    3: {
        bgColor: 'bg-yellow-400',
        textColor: 'first-letter:text-yellow-400',
        selectionColor: 'selection:bg-yellow-400',
        name: 'Yellow',
    },
};

app.get('/page/:id', ({ params: { id }, headers, set }) => {
    if (!colors[+id]) {
        set.redirect = '/';
        return;
    }

    const Wrapper = isHTMXRequest(headers) ? Fragment : BaseBody;
    return (
        <Wrapper>
            <div id="page-container" class="w-80">
                <div _="on mouseenter add .border-4 on mouseout remove .border-4 on me" hx-push-url="true" class={`h-40 w-40 border-black ${colors[+id].bgColor}`} style={`view-transition-name: box${id}`} hx-get="/container" hx-target="#page-container" />
                <h1 class={`text-4xl font-bold ${colors[+id].textColor} first-letter:text-6xl`}>{`${colors[+id].name} color`}</h1>
                <p class={`${colors[+id].selectionColor}`}>Dolor dolorem sunt quisquam illum facere. Quidem odit voluptatum pariatur cum sapiente! Soluta non dicta error beatae repellendus vel maxime Corrupti nemo eveniet ipsa consequuntur id. Nobis consectetur dolor inventore.</p>
            </div>
        </Wrapper>
    );
},
    {
        params: t.Object({
            id: t.String()
        })
    }
);

app.onError(({ set }) => set.redirect = '/');

app.listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const isHTMXRequest = (headers: Record<string, string | null>) => headers['hx-request'] === 'true';

const BaseHtml = ({ children }: PropsWithChildren) => `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>View Transitions</title>
<script src="https://unpkg.com/htmx.org@1.9.3"></script>
<script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
<script> htmx.config.globalViewTransitions = true; </script>
<link href="/output.css" rel="stylesheet">
</head>

${children}
`;

const BaseBody = ({ children }: PropsWithChildren) => (
    <BaseHtml>
        <body class="flex w-full h-screen justify-center items-center">
            { children }
        </body>
    </BaseHtml>
);

const Fragment = ({ children }: PropsWithChildren) => <>{ children }</>;
