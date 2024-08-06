For Scraping URL
- Given 1 CPU and 1GB RAM server to run the BE, to scale your scraper to handle ~5000 URL at the same time. My solution is to split the URL list into batch and process it sequently
- Other way is to use PM2 to have many more BE instance to run scrapper togehter

For docker
- Currently, the docker-compose.yml is having issue and thus it is not in working right now 