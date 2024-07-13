# /user/released

---

- `Authorization: Yes`

- `Method: GET`

## Data parameter

### Required

- `None`

### Optional

- `None`

### Success response

Status is defined in the Status.md file

```
Status code: 200
Content: {
  status: 'success',
  message: 'The account is released',
}
```

### Error response

```
Status code: 401
Content: {
  status: 'unreleased',
  message: 'The account is not released',
}
```
