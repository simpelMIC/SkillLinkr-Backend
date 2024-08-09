# /user/profilepicture

---

- `Authorization: Yes`

- `Method: POST`

## Data parameter

### Required

- `file: File` - upload as file param, only png files accepted

### Optional

- `None`

### Success response

Status is defined in the Status.md file

```
Status code: 201
Content: {
  status: 'success',
  message: 'Uploaded the file successfully'
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
