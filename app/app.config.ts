export default defineAppConfig({
  ui: {
    colors: {
      primary: 'red',
      neutral: 'stone',
    },
    icons: {
      arrowLeft: 'i-hugeicons:arrow-left-01',
      arrowRight: 'i-hugeicons:arrow-right-01',
      arrowDown: 'i-hugeicons:arrow-down-01',
      arrowUp: 'i-hugeicons:arrow-up-01',
      menu: 'i-hugeicons:menu-01',
    },
    main: {
      base: 'min-h-[calc(100vh-64px-var(--ui-header-height))]',
    },
    input: {
      slots: {
        root: 'relative inline-flex items-center w-full',
      },
    },
    textarea: {
      slots: {
        root: 'relative inline-flex items-center w-full',
      },
    },
    pageCard: {
      slots: {
        container: 'backdrop-blur-xs',
      },
    },
    // button: {
    //   rounded: 'rounded-full',
    //   variant: {
    //     solid: 'shadow-sm text-white dark:text-gray-900 bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-{color}-400 dark:hover:bg-{color}-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
    //     outline: 'ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400',
    //     soft: 'text-{color}-500 dark:text-{color}-400 bg-{color}-50 hover:bg-{color}-100 disabled:bg-{color}-50 dark:bg-{color}-950 dark:hover:bg-{color}-900 dark:disabled:bg-{color}-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400',
    //     ghost: 'text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400',
    //     link: 'text-{color}-500 hover:text-{color}-600 disabled:text-{color}-500 dark:text-{color}-400 dark:hover:text-{color}-500 dark:disabled:text-{color}-400 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400',
    //     cta: 'shadow-sm text-white dark:text-gray-200 disabled:bg-{color}-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400',
    //   },
    // },
  },
})
