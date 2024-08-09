# /user/profilepicture

---

- `Authorization: Yes`

- `Method: Delete`

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
  message: 'Deleted the file successfully'
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
