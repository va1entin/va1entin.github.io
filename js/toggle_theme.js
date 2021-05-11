function toggle() {
  var dark_theme = document.getElementById('dark_css');

  if (dark_theme.rel != "prefetch") {
    //console.log('Removing dark');
    dark_theme.rel = "prefetch";
    dark_theme.as = "style";
  }
  else {
    //console.log('Adding dark');
    dark_theme.rel = "stylesheet";
    dark_theme.removeAttribute("as")
  }
}

