# /user

---

- `Authorization: Yes`

- `Method: DELETE`

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
  message: 'User deleted',
}
```

### Error response

```
Status code: 400
Content: {
  status: 'error' | 'unauthorized',
  message: string,
}
```
