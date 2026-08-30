import {Button, action, defineFrontend} from "@modula/product-ui";

const wordCount = action({id: "digital.modula.vault-notes.formatting.function.word-count", family: "function.invoke", label: "Word count", functionId: "digital.modula.vault-notes.formatting.function.word-count"});
const copyMarkdown = action({id: "digital.modula.vault-notes.formatting.function.copy-markdown", family: "function.invoke", label: "Copy as Markdown", functionId: "digital.modula.vault-notes.formatting.function.copy-markdown"});
const heading = action({id: "digital.modula.vault-notes.formatting.function.heading", family: "function.invoke", label: "Format heading", functionId: "digital.modula.vault-notes.formatting.function.heading"});
const quote = action({id: "digital.modula.vault-notes.formatting.function.quote", family: "function.invoke", label: "Format quote", functionId: "digital.modula.vault-notes.formatting.function.quote"});
const checklist = action({id: "digital.modula.vault-notes.formatting.function.checklist", family: "function.invoke", label: "Format checklist", functionId: "digital.modula.vault-notes.formatting.function.checklist"});

export default defineFrontend({
  mode: "host-contribution",
  hostRuntime: {versionRange: ">=1.0.0 <2.0.0"},
  actions: [wordCount, copyMarkdown, heading, quote, checklist],
  contributions: [
    {id: "digital.modula.vault-notes.formatting.contribution.word-count", target: "digital.modula.vault-notes/note.inspector@1", action: wordCount, component: <Button label="Word count" action={wordCount} />, requiredPermissions: ["notes.editor.contribute"]},
    {id: "digital.modula.vault-notes.formatting.contribution.copy-markdown", target: "digital.modula.vault-notes/note.actions@1", action: copyMarkdown, component: <Button label="Copy as Markdown" action={copyMarkdown} />, requiredPermissions: ["notes.actions.contribute"]},
    {id: "digital.modula.vault-notes.formatting.contribution.heading", target: "digital.modula.vault-notes/editor.command@1", action: heading, component: <Button label="Format heading" action={heading} />, requiredPermissions: ["notes.editor.contribute"]},
    {id: "digital.modula.vault-notes.formatting.contribution.quote", target: "digital.modula.vault-notes/editor.command@1", action: quote, component: <Button label="Format quote" action={quote} />, requiredPermissions: ["notes.editor.contribute"]},
    {id: "digital.modula.vault-notes.formatting.contribution.checklist", target: "digital.modula.vault-notes/editor.command@1", action: checklist, component: <Button label="Format checklist" action={checklist} />, requiredPermissions: ["notes.editor.contribute"]},
  ],
  accessibility: {declaration: "host-baseline-with-product-semantics", screenReader: true, scalableText: true, keyboardNavigation: true, reduceMotion: true},
});
