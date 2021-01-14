# Javascript implementation for a specific Github Action

This action does following:
- Gets latest release tag name
- Calculates next release tag name using Entando's policy
- Makes a new release with that new tagname

## Inputs

### `repo`

**Required** The name of the repository (e.g `app-builder`).

### `owner`

**Required** The name of the owner of the repository (e.g `entando`).


### `GITHUB_TOKEN`

**Required** Token used for making auth requred call when making a new release  (e.g `entando`).

## Outputs

### `nextTagName`

Next tag name

## Example usage

id: 'release_manager'  
uses: ichalagashvili/release-managaer@master  
with:  
&nbsp;&nbsp;GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  
&nbsp;&nbsp;owner: 'ichalagashvili'  
&nbsp;&nbsp;repo: 'app-builder'
