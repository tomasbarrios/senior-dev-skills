import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  // throw new Error("HEY MEN")
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

/*
You could delete this, still the ErrorBoundary in the root will catch all errors,
But you can gracefully fail if you do it here (still show the sidebar in the notes page)

### WITH this function implemented (will only "Locally" fail)
_________________________________
 Header
---------------------------------
|         |                     |
|         |                     |
|         |                     |
|   OK    |      ERROR CAN BE   |
| CONTENT |     PRESENTED HERE  |
|         |                     |
|         |                     |
_________________________________

### WITHOUT this function implemented (global fail via `root` file)

`root` is ready to receive any fail from any page or the header
_________________________________
 
Something went wrong: <Stacktrace>
_________________________________

By default, you will only have what the error is talking about. Basically at this point ytou are concerned about two things
- Unexpected errors
- Uneexpected errors within _some page_ (cases when the layout renders ok. Elements like header, siderbar, footer, etc. i.e. The page is)

*/
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
