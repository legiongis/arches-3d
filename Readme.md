# Arches 3D

[![Build Status](https://dev.azure.com/globaldigitalheritage/Arches%203D/_apis/build/status/globaldigitalheritage.arches-3d)](https://dev.azure.com/globaldigitalheritage/Arches%203D/_build/latest?definitionId=1)

This implementation of [Arches](archesproject.org) adds 3D functionality to the heritage platform.

# Usage

To run:
```
docker-compose up
```


# File Extraction 
A number of web viewers, such as Potree and Virtual Tours, rely on data in a particular folder structure. 
These folders should be uploaded to Arches 3D as a zip file. Arches 3D subsequently looks for the folder contents under `<uploaded zip path>_extracted`.

Extraction of these zip files is not executed by Arches 3D. Instead, the use of an automated extraction script is advised.
We use Azure Logic App to trigger an extraction for each zip that is uploaded to our blob storage account in Azure. Tutorial: https://www.youtube.com/watch?v=liyiBUV7ICw