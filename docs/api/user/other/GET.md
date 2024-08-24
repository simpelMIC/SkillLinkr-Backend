# /user/other/{id}

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
  message: {
    id: string,
    firstname: string,
    lastname: string,
    mail: string,
    biography: string | null,
    released: boolean,
    role: {
      id: number,
      name: string,
      description: string,
      createdAt: Date,
      updatedAt: Date
    },
    profilePictureName: string | null,
    updatedAt: Date,
    createdAt: Date
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
