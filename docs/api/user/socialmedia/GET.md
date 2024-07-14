# /user/socialmedia

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
    discordName: string | null,
    facebookName: string | null,
    instagramName: string | null,
    xName: string | null,
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
