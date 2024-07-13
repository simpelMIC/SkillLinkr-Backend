# /register

---

- `Authorization: No`

- `Method: POST`

## Data parameter

### Required

- `mail: string`
- `firstname: string`
- `lastname: string`
- `password: string`
- `passwordConfirm: string`

### Optional

- `None`

### Success response

Status is defined in the Status.md file

```
Status code: 201
Content: {
  status: 'success',
  message: {
    token: string // The JWT token
  },
}
```

### Error response

```
Status code: 400
Content: {
  status: 'error',
  message: string,
}
```
