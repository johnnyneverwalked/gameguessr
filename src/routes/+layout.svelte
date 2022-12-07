<script lang="ts">
    import '@brainandbones/skeleton/styles/all.css';
    import '@brainandbones/skeleton/themes/theme-modern.css';
    import "../app.css";
    import logo from "$lib/assets/logo.png";
    import {AppBar, AppShell, GradientHeading, LightSwitch} from "@brainandbones/skeleton";

</script>

<AppShell>
    <svelte:fragment slot="header">
            <AppBar padding="px-4 py-2" shadow="shadow">
                <svelte:fragment slot="lead">
                    <img alt="logo" width="48" src="{logo}"/>
                    <GradientHeading tag="h1" from="from-accent-400 dark:from-accent-500" to="to-primary-300 dark:to-primary-500" class="font-extrabold drop-shadow-sm text-2xl md:hidden mx-2">GGr</GradientHeading>
                </svelte:fragment>
                <GradientHeading tag="h1" from="from-accent-400 dark:from-accent-500" to="to-primary-300 dark:to-primary-500" class="font-extrabold drop-shadow-sm text-3xl hidden md:block lg:text-center">GameGuessr</GradientHeading>
                <svelte:fragment slot="trail">
                    <LightSwitch/>
                </svelte:fragment>
            </AppBar>
    </svelte:fragment>

    <slot/>

    <svelte:fragment slot="footer">
        <div class="text-center">
            <h4 class="">Made with
                <span class="text-primary-500 mx-1">❤</span> by
                <a href="https://github.com/johnnyneverwalked" target="_blank">JohnnyNeverWalked</a>
            </h4>
        </div>
    </svelte:fragment>
</AppShell>
