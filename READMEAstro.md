# Astro Starter Kit: Blog

This file is a history of the ways we use Astro

# pages layouts

https://docs.astro.build/en/guides/markdown-content/

```
---
import BaseHead from "../components/BaseHead.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
const { frontmatter } = Astro.props;
const { title, description } = frontmatter;
---

...MDX content 

```

This enables a special way to user mdx info, different than normal. "normal" refers to files in the `content` folder