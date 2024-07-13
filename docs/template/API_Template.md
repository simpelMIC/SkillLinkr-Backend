# /path/{params?}

---

- `Authorization: Yes | No`

- `Method: GET | POST | PATCH | DELETE`

## Data parameter

### Required

- `paramName: string | number | boolean`

### Optional

- `paramName: string | number | boolean`

### Success response

Status is defined in the Status.md file

```
Status code: e.g. 200
Content: {
  status: Status,
  message: string | object,
}
```

### Error response

```
Status code: e.g. 400
Content: {
  status: Status,
  message: string | object,
}
```
