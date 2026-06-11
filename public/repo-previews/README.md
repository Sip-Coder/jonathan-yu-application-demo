# Repo Website Previews

Generated static previews for GitHub-backed project websites used by the Portfolio screen-in-screen section.

Regenerate from local built project outputs with:

```powershell
npm.cmd run sync:repo-previews
```

Source build folders:
- `C:\codebase\sip_studies\actual\Rose-Quartz\dist`
- `C:\codebase\sip_studies\actual\Coffee-Index\dist`
- `C:\codebase\sip_studies\actual\Sip-Studies-Tasting-Journal\dist\public`

The sync rewrites root-relative asset paths so the snapshots can run from `/repo-previews/<slug>/` inside iframes.
