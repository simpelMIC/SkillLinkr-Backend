# /user/teaching

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
    id: number,
    userId: string,
    teachesInPerson: boolean,
    teachesOnline: boolean,
    teachingCity: string | null,
    teachingCountry: string | null,
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
