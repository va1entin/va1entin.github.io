---
author: Valentin Heidelberger
comments: false
date: "2021-03-02T15:53:11Z"
header_img: /img/tags/data.webp
subtitle: ""
tags:
- data
- docker
- technology
- cheatsheet
- linux
title: Python cheat sheet for InfluxDB2 (influxdb_client)
toc: true
---


# Setup InfluxDB test instance with Docker

```bash
docker run -d -p 8086:8086 --name influxdb influxdb
```

This command pulls the latest InfluxDB image from Docker Hub, runs it with the name `influxdb` and makes the default port `8086` available on `localhost`.
Once the container is up and running, we need to setup InfluxDB before we can use it.

Open a shell in the InfluxDB container:

```bash
docker exec -it influxdb bash
```

Start the interactive setup wizard by running `influx setup`.
The wizard will ask you to provide initial admin credentials, your first organization, your first bucket and a retention period for it.

I have created a user `val` with a password (invisible in the wizard), an organization called `my_org` and a bucket `my_bucket`:

```
root@d8818fce8c18:/# influx setup
Welcome to InfluxDB 2.0!
Please type your primary username: val

Please type your password:

Please type your password again:

Please type your primary organization name: my_org

Please type your primary bucket name: my_bucket

Please type your retention period in hours.
Or press ENTER for infinite.:
```

Lastly, the wizard will ask you to confirm your inputs:

```
You have entered:
  Username:          val
  Organization:      my_org
  Bucket:            my_bucket
  Retention Period:  infinite
Confirm? (y/n): y

Config default has been stored in /root/.influxdbv2/configs.
User    Organization    Bucket
val     my_org          my_bucket
```

One advantage of performing the setup using the CLI is that it writes your initial admin user's credentials to a config file, allowing you to manage your InfluxDB instance using the `influx` CLI directly with admin privileges.

We'll use this to get our initial admin user's token, which we'll use later to set up the connection to InfluxDB in Python.

`influx auth list` gives us a list of existing users and tokens. For the sake of readability I'm using `awk` to limit output to just the token.

```bash
root@d8818fce8c18:/# influx auth list | awk 'FNR>1 {print $4}'
_U13AGG9YWojXjuh2OAUKqtsA20Fual8Vt_aVTvdJ1eWUJu0pH85ppkCEM3lL5hEpNS_8vPRh7nik8QkEvfZFA==
```

Save your token somewhere to have it at hand for the [Connection setup](#connection-setup) step.

Now, we can exit the container shell:

```bash
root@d8818fce8c18:/# exit
```
<br>
<hr>
<br>

# Install influxdb_client with pip

Depending on your setup and linux distro you might want to do this with the distro's package manager.

```bash
pip3 install influxdb-client # NOT 'influx-client' or 'influxdb'!
```
<br>
<hr>
<br>

# Connection setup (required for all steps below)


```python
import influxdb_client

my_client = influxdb_client.InfluxDBClient(
  url=my_url,
  token=my_token,
  org='my_org'
)
```

To connect to the docker test instance, use the token obtained after the [InfluxDB setup](#setup-influxdb-test-instance-with-docker):

```python
import influxdb_client

my_client = influxdb_client.InfluxDBClient(
  url='http://localhost:8086',
  token='_U13AGG9YWojXjuh2OAUKqtsA20Fual8Vt_aVTvdJ1eWUJu0pH85ppkCEM3lL5hEpNS_8vPRh7nik8QkEvfZFA==',
  org='my_org'
)
```
<br>
<hr>
<br>

# Test connection

```python
my_client.ready()

{'started': datetime.datetime(2021, 2, 23, 16, 5, 29, 916723, tzinfo=tzlocal()),
 'status': 'ready',
 'up': '47m11.068245257s'}
```
<br>
<hr>
<br>

# Query data
<br>

## Get query api

Firstly, obtain a query API instance:

```python
influxdb_query_api = my_client.query_api()
```
<br>

## Create a query

Check out the official [documentation](https://docs.influxdata.com/influxdb/v2.0/query-data/get-started/) for the Flux query language to learn how to build queries.

This is a very basic example getting all data points of the measurement `my_measurement` from the last 100 minutes in `my_bucket`.

```python
query = 'from(bucket:"my_bucket")\
|> range(start: -100m)\
|> filter(fn:(r) => r._measurement == "my_measurement")'
```
<br>

## Run a query

```python
result = influxdb_query_api.query(org='my_org', query=query)
```

See the official [InfluxDB documentation](https://docs.influxdata.com/influxdb/cloud/tools/client-libraries/python/#query-data-from-influxdb-with-python) for ways to use the result data including an example script.

<br>

## Get dict from data point

For this example I have created a data point as shown [here](#write-a-data-point).

Assuming you have a `influxdb_client.Point` object, a dict representation of it's contents can be obtained like so:

```python
point.__dict__
```

The output will look something like this:

```python
{'_tags': {'my_tag': 'my_value'}, '_fields': {'my_first_field': 'my second field value'}, '_name': 'my_measurement', '_time': datetime.datetime(2021, 3, 3, 13, 54, 7, 692337), '_write_precision': 'ms'}
```

<br>
<hr>
<br>

# Write data
<br>

## Get write api

You need to specify which `write option` the client shall use when creating the instance.
At the time of writing this post the possible write options are: synchronous, asynchronous, batching

There are shortcuts for `synchronous` and `asynchronous`.

```python
influxdb_client.client.write_api.SYNCHRONOUS

influxdb_client.client.write_api.ASYNCHRONOUS
```

`batching` is accessible by creating an `WriteOptions` instance and passing it the `WriteType` of `batching`:

```python
influxdb_client.client.write_api.WriteOptions(influxdb_client.client.write_api.WriteType.batching)
```

Using the `write option`, that you've decided for, you can get a `write api` instance:
```python
influxdb_write_api = my_client.write_api(write_options=influxdb_client.client.write_api.SYNCHRONOUS)
```
<br>

## Write a data point

A data point is created from an `influxdb_client.Point` object. To put our data in, we can either:

* use various functions of the Point object itself
* pass it a dict

I prefer using a dict, because I think it's much more readable and easy to understand. This might be especially useful for people who know Python but are not perfectly familiar with how `influxdb_client.Point` objects work in detail.

`my_time` must be a timestamp, that InfluxDB understands.


```python
point = influxdb_client.Point.from_dict(
    {
        'measurement': 'my_measurement',
        'tags': {'my_tag': 'my_value'},
        'fields': {
            'my_first_field': 'my first field value',
            'my_first_field': 'my second field value'
            },
        'time': 'my_time',
    },
    influxdb_client.WritePrecision.MS
)

influxdb_write_api.write('my_bucket', 'my_org', point)
```

For example, you can use the `datetime` module:

```python
import datetime

point = influxdb_client.Point.from_dict(
    {
        'measurement': 'my_measurement',
        'tags': {'my_tag': 'my_value'},
        'fields': {
            'my_first_field': 'my first field value',
            'my_first_field': 'my second field value'
            },
        'time': datetime.datetime.now(),
    },
    influxdb_client.WritePrecision.MS
)

influxdb_write_api.write('my_bucket', 'my_org', point)
```

<br>
<hr>
<br>

# Buckets

Firstly, obtain a buckets API instance:

```python
influxdb_buckets_api = my_client.buckets_api()
```
<br>

## Get all buckets in current org

```python
bucket_objects = influxdb_buckets_api.find_buckets()
```
<br>

## Get all bucket names in current org

```python
bucket_objects = influxdb_buckets_api.find_buckets()
bucket_names = [bucket.name for bucket in bucket_objects.buckets]
```
<br>

## Get bucket object by bucket name

```python
my_bucket = influxdb_buckets_api.find_bucket_by_name('my_bucket')
```
<br>

## Create bucket

See [this section](#get-org-id) for getting `my_org_id`

```python
new_bucket = influxdb_client.domain.bucket.Bucket(
  name='my_new_bucket',
  retention_rules=[],
  org_id=my_org_id
)
influxdb_buckets_api.create_bucket(new_bucket)
```
<br>

## Delete bucket

```python
bucket = influxdb_buckets_api.find_bucket_by_name('my_bucket')
influxdb_buckets_api.delete_bucket(bucket.id)
```
<br>
<hr>
<br>

# Organizations

Firstly, obtain a organizations API instance:

```python
influxdb_org_api = influxdb_client.OrganizationsApi(my_client)
```
<br>

## Get all organizations
```python
orgs = influxdb_org_api.find_organizations()
```
<br>

## Get organization id

Look for your organization in the list of all organizations `orgs`, which you obtained in the previous step.

```python
for org in orgs:
  if org.name == 'my_org':
    my_org_id = org.id
    print(my_org_id)
```
<br>

## Create organization

`my_new_org` will be the new organization's name.

```python
influxdb_org_api.create_organization('my_new_org')
```
<br>

## Delete organization

To delete an organization, you need it's ID. See [Get organization id](#get-organization-id).

```python
influxdb_org_api.delete_organization(my_org_id)
```
<br>
